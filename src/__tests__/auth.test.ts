// Node imports
import request from 'supertest';

// Custom imports
import app from '@/app';
import { User } from '@/models/user';
import * as dbHandler from '@/__tests__/utils/db.handler';

describe('Auth Routes', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  it('Should register new user successfully and return a 201 status code', async () => {
    // Arrange
    const user = {
      name: 'Abdul Rafay',
      email: 'rafaysh70@gmail.com',
      password: 'rafay2970787',
      role: 'User',
    };

    // Act
    const response = await request(app).post('/auth/register').send(user);
    if (response.status !== 201) {
      console.log('Test Failed Response: ', response.body);
    }

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');

    const userCreated = await User.findOne({ email: user.email });
    expect(userCreated).not.toBeNull();
    expect(userCreated?.name).toBe(user.name);
    expect(userCreated?.password).not.toBe(user.password);
  });
});
