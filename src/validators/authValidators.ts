import {
  emailValidator,
  nameValidator,
  passwordValidator,
  roleValidator,
} from '@/validators/commonValidators';

export const registerValidator = [
  nameValidator,
  emailValidator,
  passwordValidator,
  roleValidator,
];

export const loginValidator = [emailValidator, passwordValidator];
