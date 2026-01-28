// Node modules
import mongoose from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'User' | 'Admin';
  totalVisitCount: number;
  passwordResetToken: string | null;
  refreshToken: string | null;
  refreshTokenStatus: 'revoked' | 'active';
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ['User', 'Admin'],
        message: `{VALUE} is not supported`,
      },
    },
    totalVisitCount: {
      type: Number,
      default: 0,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    refreshTokenStatus: {
      type: String,
      enum: {
        values: ['revoked', 'active'],
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>('User', userSchema, 'users');
