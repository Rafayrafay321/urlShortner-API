// Node modules
import { body, param } from 'express-validator';

export const nameValidator = body('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required');

export const emailValidator = body('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Invalid email address')
  .normalizeEmail();

export const passwordValidator = body('password')
  .notEmpty()
  .withMessage('Password is required')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 character long');

export const roleValidator = body('role')
  .notEmpty()
  .withMessage('Role is required')
  .isIn(['User', 'Admin'])
  .withMessage('Role is not supported');

export const urlValidator = body('url')
  .trim()
  .notEmpty()
  .withMessage('URL is required')
  .isURL({ require_protocol: true, require_tld: true })
  .withMessage('Invalid URL');

export const mongoIdValidator = param('id')
  .isMongoId()
  .withMessage('Invalid ID format');
