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

  //* Testing Register Routes.

  describe('POST /auth/register', () => {
    it('Should register a new user successfully (201)', async () => {
      // Act
      const response = await request(app).post('/auth/register').send(mockUser);

      // Assert: API Response
      expect(response.status).toBe(201);
      expect(response.body.User).toHaveProperty('email', mockUser.email);

      // Assert: Security Check
      expect(response.body.User).not.toHaveProperty('password');
      expect(response.body.User).not.toHaveProperty('__v');

      // Assert: Database State.
      const userInDb = await User.findOne({ email: mockUser.email });
      expect(userInDb).not.toBeNull();
      expect(userInDb?.password).not.toBe(mockUser.password);
    });

    it('Should block registration if email already exists (409)', async () => {
      // Arrange
      await request(app).post('/auth/register').send(mockUser);
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

  //* Testing Login Routes.

  describe('POST /auth/login', () => {
    it('Should login and set the HTTP-Only cookie', async () => {
      // Arrange: Creating User by hiting the register end-point.
      await request(app).post('/auth/register').send(mockUser);

      // Act
      const loginUser = await request(app).post('/auth/login').send({
        email: mockUser.email,
        password: mockUser.password,
      });

      // Assert: API Response
      expect(loginUser.status).toBe(200);

      // Assert: Check for "Set-Cookie" header.
      const cookies = loginUser.headers['set-cookie'];

      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('refreshToken');
      expect(cookies[0]).toContain('HttpOnly');
    });

    it('Should failed to login with an incorrect password (400)', async () => {
      await request(app).post('/auth/register').send(mockUser);
      const response = await request(app).post('/auth/login').send({
        email: mockUser.email,
        passwrod: 'wrongPassword',
      });

      expect(response.status).toBe(400);
    });

    it('Should validate missing fileds (400)', async () => {
      // Arrange: Creating User by hiting the register end-point.
      await request(app).post('/auth/register').send(mockUser);

      const inValiduser: InvalidRegisteruserInterface = {
        email: mockUser.email,
      };
      // Act.
      const response = await request(app).post('/auth/login').send(inValiduser);
      // Assert: API Response
      expect(response.status).toBe(400);
    });
  });
});
