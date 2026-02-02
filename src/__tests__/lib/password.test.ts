import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '@/lib/password';

describe('Password Utilities', () => {
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
    it('should return true for a correct password', async () => {
      const hashedPassword = await hashPassword(rawPassword);
      const isMatch = await comparePassword(rawPassword, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false for an incorrect password', async () => {
      const hashedPassword = await hashPassword(rawPassword);
      const isMatch = await comparePassword('wrongPassword', hashedPassword);
      expect(isMatch).toBe(false);
    });
  });
});
