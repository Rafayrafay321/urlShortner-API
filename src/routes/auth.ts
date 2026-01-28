import { Router } from 'express';
// import bcrypt from 'bcrypt';

// custom imports
import register from '@/controllers/auth/register';
import login from '@/controllers/auth/login';
import logout from '@/controllers/auth/logout';
import refreshToken from '@/controllers/auth/refreshToken';
import validationError from '@/middleware/validationError';
import { registerValidator, loginValidator } from '@/validators/authValidators';
import expressRateLimit from '@/middleware/rateLimiter';

const router = Router();

// Post route to register user.
router.post(
  '/register',
  expressRateLimit('auth'),
  registerValidator,
  validationError,
  register,
);

// Post route for user login.
router.post(
  '/login',
  expressRateLimit('auth'),
  loginValidator,
  validationError,
  login,
);

// Post route for refresh-token.
router.post('/refresh-token', refreshToken);

// post route for user logout.
router.post('/logout', logout);

export default router;
