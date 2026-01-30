// Node imports
import request from 'supertest';

// Custom imports
import app from '@/app';
import { User } from '@/models/user';
import * as dbHandler from '@/__tests__/utils/db.handler';

// Interfaces
interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  role: 'User' | 'Admin';
}

// Types
type InvalidRegisteruserInterface = Partial<RegisterUserInput>;

// Reuseable Fixture of User.
const mockUser: RegisterUserInput = {
  name: 'Abdul Rafay',
  email: 'rafaysh70@gmail.com',
  password: 'rafay2970787',
  role: 'User',
};

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

  describe('POST /auth/register', () => {
    it('Should register a new user successfully (201)', async () => {
      // Act
      const response = await request(app).post('/auth/register').send(mockUser);

      // Assert: API Response
      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('email', mockUser.email);

      // Assert: Security Check
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user).not.toHaveProperty('__v');

      // Assert: Database State.
      const userInDb = await User.findOne({ email: mockUser.email });
      expect(userInDb).not.toBeNull();
      expect(userInDb?.password).not.toBe(mockUser.password);
    });

    it('Should block registration if email already exists (409)', async () => {
      // Act
      const response = await request(app).post('/auth/register').send(mockUser);

      // Assert: API
      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/already exists/i);
    });

    it('Should validate missing fields (400)', async () => {
      // Arrange
      const inValiduser: InvalidRegisteruserInterface = { ...mockUser };
      delete inValiduser.password;

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(inValiduser);

      // Assert: API
      expect(response.status).toBe(400);
    });
  });

  // it('Should Login the user and sets the token in cookie', async () => {
  //   // Arrange
  //   const userToLogin = {
  //     email: 'rafaysh70@gmail.com',
  //     password: 'rafay2970787',
  //   };

  //   const response = await request(app).post('/auth/login').send(userToLogin);
  // });
});
