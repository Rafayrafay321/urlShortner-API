import { Types } from 'mongoose';
import 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
    }
  }
}

export {};
