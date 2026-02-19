import { z } from 'zod';

const emailField = z.email('Invalid Credentials').trim().toLowerCase();
const passwordField = z
  .string()
  .min(8, 'Password must be atleast 8 characters');

export const userLoginSchema = z.object({
  body: z.object({
    email: emailField,
    password: passwordField,
  }),
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;

export const userRegisterSchema = z.object({
  body: z.object({
    email: emailField,
    password: passwordField,
    name: z.string().trim(),
    role: z.enum(['ADMIN', 'USER']),
  }),
});

export type UserRegisterInput = z.infer<typeof userRegisterSchema>;

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailField,
  }),
});

export type forgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  body: z.object({
    password: passwordField,
    passwordConfirmation: passwordField,
  }),
});

export type resetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const forgotPasswordTokenSchema = z.object({
  query: z.object({
    token: z
      .string('Token is required')
      .min(1, 'Token cannot be empty')
      // Optional: Basic regex check for JWT structure (3 parts separated by dots)
      .regex(
        /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
        'Invalid token format',
      ),
  }),
});

export type forgotPasswordTokeninput = z.infer<
  typeof forgotPasswordTokenSchema
>;
