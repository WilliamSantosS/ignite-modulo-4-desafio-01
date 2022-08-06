import request from 'supertest';
import { app } from '../../../../app';
import { Connection, createConnection  } from 'typeorm';

let connection: Connection;
describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
  })

  it("Should be able to make a deposit", async () => {
    await request(app).post('/api/v1/users').send({
      name: "profileTest",
      email: "statement@useremail.com",
      password: "statementPassword"
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: "statement@useremail.com",
      password: 'statementPassword'
    })

    const { token } = responseToken.body;

    const response = await request(app).post('/api/v1/statements/deposit').send({
      amount: 500,
      description: "deposit description"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
  })

  it("Should be able to make a withdraw", async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: "statement@useremail.com",
      password: 'statementPassword'
    })

    const { token } = responseToken.body;

    const response = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 50,
      description: "withdraw description"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
  });

  it("Should not be able to make a withdraw to a value greater than the balance", async () => {
    await request(app).post('/api/v1/users').send({
      name: "profileTest",
      email: "anothertestuser@email.com",
      password: "statementPassword"
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: "anothertestuser@email.com",
      password: 'statementPassword'
    })

    const { token } = responseToken.body;

    await request(app).post('/api/v1/statements/balance').send({
      amount: 500,
      description: "withdraw description"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 1000,
      description: "withdraw description"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(400);
  });

  it("Should not be able to make a statement for a non existent user", async () => {
    const response = await request(app).post('/api/v1/statements/deposit').send({
      amount: 1000,
      description: "withdraw description"
    }).set({
      Authorization: `Bearer invalidtoken`,
    });

    expect(response.status).toBe(401);
  })
});
