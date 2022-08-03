import { AppError } from '../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementRepository )
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementRepository)
  })

  it("Should be able to get the Statement Operation", async () => {

    const user = await createUserUseCase.execute({
      email: "test@test.com.br",
      name: "test",
      password: "testpassword"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: 'test'
    });

    const operationStatement = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    });

    expect(operationStatement).toHaveProperty('amount');
  })

  it("Should not be able to get the Statement Operation for a non existent user", () => {
    expect(async() => {
       await getStatementOperationUseCase.execute({
        user_id: 'nonexistent_id',
        statement_id: 'nonexistent_id'
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to get the Statement Operation for a invalid statement", () => {
    expect(async() => {
      const user = await createUserUseCase.execute({
        email: "another@test.com.br",
        name: "another test",
        password: "testpassword"
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 20,
        description: 'another'
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: 'nonexistent_id'
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})
