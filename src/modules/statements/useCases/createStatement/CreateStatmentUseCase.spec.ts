import { AppError } from '../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to create a new Statement", async () => {

    const user = await createUserUseCase.execute({
      email: "test@test.com.br",
      name: "test",
      password: "testpassword"
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: 'test'
    })

    expect(statement).toHaveProperty('id');
  })

  it("Should not be able to create a Statement for a non existent user", () => {
    expect(async () => {
     await createStatementUseCase.execute({
        user_id: 'nonexistent',
        type: OperationType.DEPOSIT,
        amount: 20,
        description: 'error_test'
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("Should not be able to do a withdraw for a value higher than the account possess", () => {
    expect(async() => {
      const user = await createUserUseCase.execute({
        email: "withdraw@withdraw.com.br",
        name: "withdraw",
        password: "testpassword"
      })

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: 'test'
      })

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 200,
        description: 'test'
      })
    }).rejects.toBeInstanceOf(AppError);
  })
})
