import mongoose from 'mongoose';
import { Types } from 'mongoose';

export interface IUrl {
  originalUrl: string;
  shortUrl: string;
  userId: Types.ObjectId;
  clicks: number;
}

const urlSchema = new mongoose.Schema<IUrl>(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Url = mongoose.model<IUrl>('Url', urlSchema, 'urls');
