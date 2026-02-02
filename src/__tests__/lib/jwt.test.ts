import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
  verifyAccessToken,
  verifyRefreshToken,
} from '@/lib/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

describe('jsonWebTokenb Utilities', () => {
  const JwtPayload: TokenPayload = { userId: 'qwertyuiop' };

  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe('refreshToken', () => {
    it('Should genrate a valid JWT string', () => {
      const refreshToken = generateRefreshToken(JwtPayload);

      // Assert
      expect(refreshToken).not.toBeNull();
      expect(typeof refreshToken).toBe('string');
      expect(refreshToken.split('.')).toHaveLength(3);
    });

    it('Should verify a valid token and return decoded payload', () => {
      const refreshToken = generateRefreshToken(JwtPayload);
      const result = verifyRefreshToken(refreshToken);

      expect(typeof result).toBe('object');
      expect(result).toMatchObject(JwtPayload);
    });

    it('should verift an invalid token', () => {
      const invalidRefreshToken = 'qwertyuioplkjhgfdsa';
      expect(() => verifyRefreshToken(invalidRefreshToken)).toThrowError(
        JsonWebTokenError,
      );
    });
    it('should verify the expired token', () => {
      const refreshToken = generateRefreshToken(JwtPayload);
      vi.advanceTimersByTime(7 * 24 * 60 * 60 * 1000 + 1000);
      expect(() => verifyRefreshToken(refreshToken)).toThrowError(
        TokenExpiredError,
      );
    });
  });

  describe('accessToken', () => {
    it('Should genrate a valid JWT string', () => {
      const accessToken = generateAccessToken(JwtPayload);

      expect(accessToken).not.toBeNull();
      expect(typeof accessToken).toBe('string');
      expect(accessToken.split('.')).toHaveLength(3);
    });
    it('Should verify a valid token and return decoded payload', () => {
      const accessToken = generateAccessToken(JwtPayload);
      const result = verifyAccessToken(accessToken);

      expect(typeof result).toBe('object');
      expect(result).toMatchObject(JwtPayload);
    });

    it('should verift an invalid token', () => {
      const invalidAccessToken = 'qwertyuioplkjhgfdsazxcvbnm';
      expect(() => verifyAccessToken(invalidAccessToken)).toThrowError(
        JsonWebTokenError,
      );
    });
    it('should verify the expired token', () => {
      const accessToken = generateAccessToken(JwtPayload);
      vi.advanceTimersByTime(7 * 24 * 60 * 60 * 1000 + 1000);
      expect(() => verifyAccessToken(accessToken)).toThrowError(
        TokenExpiredError,
      );
    });
  });
});
