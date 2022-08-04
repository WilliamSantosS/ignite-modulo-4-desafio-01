import request from 'supertest';
import { createConnection, Connection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;

describe("Create User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
  });

  it("Should be able to create a new user", async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: "testUser",
      email: "testuser@email.com",
      password: "testpassword"
    })

    expect(response.status).toBe(201);
  })

  it("Should not be able to create an user with same e-mail address", async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: "anotherUser",
      email: "testuser@email.com",
      password: "anotherpassword"
    });

    expect(response.status).toBe(400);
  })
})
