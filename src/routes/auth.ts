import { Router } from 'express';

// custom imports
import register from '@/controllers/auth/register';
import login from '@/controllers/auth/login';
import logout from '@/controllers/auth/logout';
import { forgotPassword } from '@/controllers/auth/forgotPassword';
import { resetPassword } from '@/controllers/auth/resetPassword';
import refreshToken from '@/controllers/auth/refreshToken';
import { validate } from '@/middleware/validator';
import {
  userRegisterSchema,
  userLoginSchema,
  resetPasswordSchema,
  forgotPasswordTokenSchema,
} from '@/schemas/auth.schema';
import expressRateLimit from '@/middleware/rateLimiter';

const router = Router();

// Post route to register user.
router.post(
  '/register',
  expressRateLimit('auth'),
  validate(userRegisterSchema),
  register,
);

// Post route for user login.
router.post(
  '/login',
  expressRateLimit('auth'),
  validate(userLoginSchema),
  login,
);

// Post route for refresh-token.

router.post('/refresh-token', refreshToken);

// Post route for forgot password.
router.post('/forgot-password', forgotPassword);

// Post route for reset-password
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  validate(forgotPasswordTokenSchema),
  resetPassword,
);

// post route for user logout.
router.post('/logout', logout);

export default router;
