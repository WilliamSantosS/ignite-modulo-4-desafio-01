import request from 'supertest';
import { app } from '../../../../app';
import { Connection, createConnection  } from 'typeorm';

let connection: Connection;

describe("Get Balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async() => {
    await connection.dropDatabase();
  })

  it("Should be able to get the balance", async () => {
    await request(app).post('/api/v1/users').send({
      name: "balance",
      email: "balanceTest@email.com",
      password: "balancePassword"
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: "balanceTest@email.com",
      password: 'balancePassword'
    })

    const { token } = responseToken.body;

    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
  })

  it("Should not be able to get the balance for a non existent user", async () => {
    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer nonexistent`,
    });

    expect(response.status).toBe(401);
  })
})
