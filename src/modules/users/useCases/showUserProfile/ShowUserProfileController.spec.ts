import { createConnection, Connection } from 'typeorm';
import request from 'supertest';
import { hash } from 'bcryptjs';
import { v4 as uuidV4 } from "uuid";

import { app } from '../../../../app';

let connection: Connection;
describe("Show Profile", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  it("Should be able to get the User profile", async () => {
    await request(app).post('/api/v1/users').send({
      name: "profileTest",
      email: "profileTest@email.com",
      password: "profilePassword"
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: "profileTest@email.com",
      password: 'profilePassword'
    })

    const { token } = responseToken.body;

    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
  })

  it("Should not be able to get the user profile for a non existent user", async () => {
    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer 'invalid`,
    });

    expect(response.status).toBe(401);
  })
})
