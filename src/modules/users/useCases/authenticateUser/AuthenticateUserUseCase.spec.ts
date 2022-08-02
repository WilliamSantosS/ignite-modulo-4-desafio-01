import { AppError } from '../../../../shared/errors/AppError'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let inMemomyUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
describe("Authenticate User", () => {
  beforeEach(() => {
    inMemomyUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemomyUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemomyUsersRepository)
  })
  it("Should be able to authenticate a user", async () => {
    const user: ICreateUserDTO  = {
      name: "test",
      email: "test@email.com",
      password: "123"
    }
    await createUserUseCase.execute(user)

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(authenticatedUser).toHaveProperty("token");
  })

  it("Should not be able to authenticate a user that does not exists", () => {
    expect(async () =>  {
     await authenticateUserUseCase.execute({
        email: 'error@email.com',
        password: 'error password'
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("Should not be able to authenticate a user with invalid credentials", () => {
    expect(async () => {
      const user: ICreateUserDTO  = {
        name: "test",
        email: "test@email.com",
        password: "123"
      }
      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: 'test@email.com',
        password: '144444'
      })
    }).rejects.toBeInstanceOf(AppError);
  })
})
