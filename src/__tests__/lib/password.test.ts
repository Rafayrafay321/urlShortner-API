import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '@/lib/password';
import * as dbHandler from '@/__tests__/utils/db.handler';

describe('Password Utilities', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });
  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  const rawPassword = 'mySecurePassword123';

  describe('hashPassword', () => {
    it('should return a hashed password as a string', async () => {
      const hashedPassword = await hashPassword(rawPassword);
      expect(typeof hashedPassword).toBe('string');
    });

    it('should not return the same raw password', async () => {
      const hashedPassword = await hashPassword(rawPassword);
      expect(hashedPassword).not.toBe(rawPassword);
    });
  });

  describe('comparePassword', () => {
    let hashedPassword: string;

    beforeAll(async () => {
      hashedPassword = await hashPassword(rawPassword);
    });

    it('should return true for a correct password', async () => {
      const isMatch = await comparePassword(rawPassword, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false for an incorrect password', async () => {
      const isMatch = await comparePassword('wrongPassword', hashedPassword);
      expect(isMatch).toBe(false);
    });
  });
});
