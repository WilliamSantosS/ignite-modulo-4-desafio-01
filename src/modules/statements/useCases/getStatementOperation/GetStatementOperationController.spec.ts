import request from 'supertest';
import { app } from '../../../../app';
import { Connection, createConnection  } from 'typeorm';

let connection: Connection;

describe("Get Statement Operation", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
  });

  it("Should be able to get an operation statement", async () => {

    await request(app).post('/api/v1/users').send({
      name: "operationTest",
      email: "operation@email.com",
      password: "operationpassword"
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: "operation@email.com",
      password: 'operationpassword'
    })

    const { token } = responseToken.body;

    const operation = await request(app).post('/api/v1/statements/deposit').send({
      amount: 500,
      description: "deposit description"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app).get(`/api/v1/statements/${operation.body.id}`).set({
      Authorization: `Bearer ${token}`
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it("Should not be able to get a non existent statement operation", async () => {
    await request(app).post('/api/v1/users').send({
      name: "operationTest",
      email: "operation2@email.com",
      password: "operation2password"
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: "operation2@email.com",
      password: 'operation2password'
    })

    const { token } = responseToken.body;

    const response = await request(app).get(`/api/v1/statements/asdasd`).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(500);
  })
})
