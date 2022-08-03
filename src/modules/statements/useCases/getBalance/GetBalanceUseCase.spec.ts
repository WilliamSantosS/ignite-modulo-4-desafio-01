import { AppError } from '../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase


describe("Get balance", () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementRepository, inMemoryUsersRepository);
  })

  it("Should be able to get the user balance", async () => {
    const user = await createUserUseCase.execute({
      email: "test@test.com.br",
      name: "test",
      password: "testpassword"
    })
    const balance = await getBalanceUseCase.execute({user_id: user.id as string});

    expect(balance).toHaveProperty('balance');
  });

  it("Should not be able to get the balance of a non existent user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: 'nonexistent'});
    }).rejects.toBeInstanceOf(AppError);
  })
})
