import request from 'supertest';
import { app } from '../../../../app';
import { createConnection, Connection } from 'typeorm';

let connection: Connection;
describe("Authenticate user", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
  });

  it("Should be able to authenticate an user", async () => {
    await request(app).post('/api/v1/users').send({
      name: "profileTest",
      email: "newuser@email.com",
      password: "newpassword"
    });

    const response = await request(app).post('/api/v1/sessions').send({
      email: "newuser@email.com",
      password: "newpassword"
    });

    expect(response.status).toBe(200);
  });

  it("Should not be able to authenticate a non existent user", async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: "should@fail.com.br",
      password: "12345"
    })

    expect(response.status).toBe(401);
  });

  it("Should not be able to authenticate a user with wrong credentials", async () => {
    await request(app).post('/api/v1/users').send({
      name: "profileTest2",
      email: "profileTest2@email.com",
      password: "profilePassword"
    });

    const response = await request(app).post('/api/v1/sessions').send({
      email: "profileTest2@email.com",
      password: "12345"
    })

    expect(response.status).toBe(401);
  });


})
