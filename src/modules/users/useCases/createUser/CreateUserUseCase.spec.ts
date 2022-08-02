import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"
import { AppError } from '../../../../shared/errors/AppError'

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
describe("Create user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })
  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "test user",
      email: "test@email.com",
      password:"123"
    })
    expect(user).toHaveProperty('id')
  })

  it("Shold not be able to create a user with same e-mail address", ()=> {
    expect(async () => {
      await createUserUseCase.execute({
        name: "test user",
        email: "test@email.com",
        password:"123"
      })

      await createUserUseCase.execute({
        name: "test user",
        email: "test@email.com",
        password:"123"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
