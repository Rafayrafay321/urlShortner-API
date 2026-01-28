// Node modules
import mongoose from 'mongoose';
import type { HydratedDocument, Model, Types } from 'mongoose';

// Custom Modules
import { IUser, User } from '@/models/user';
import { Url } from '@/models/url';
import { IUrl } from '@/models/url';

// Types
type UrlQuery = {
  userId?: Types.ObjectId;
  originalUrl?: string;
  shortUrl?: string;
};

type UserQuery = {
  email?: string;
  userId?: Types.ObjectId;
  refreshToken?: string;
};

// Function returning the whole document of user.
export const userExists = async (
  params: UserQuery,
): Promise<HydratedDocument<IUser> | null> => {
  if (mongoose.connection.readyState !== 1) {
    console.log('Database not connected. cannot check User existence.');
    return null;
  }
  const query: UserQuery = {};
  if (params.userId) {
    query.userId = params.userId;
  }
  if (params.email) {
    query.email = params.email;
  }
  if (params.refreshToken) {
    query.refreshToken = params.refreshToken;
  }

  return User.findOne(query);
};

// Function returning whole document of the URL exisiting.
export const urlExists = async (
  params: UrlQuery,
): Promise<HydratedDocument<IUrl> | null> => {
  if (mongoose.connection.readyState !== 1) {
    console.log('Database not connected. Cannot check for the url existence');
    return null;
  }
  const query: UrlQuery = {};

  if (params.userId) {
    query.userId = params.userId;
  }
  if (params.originalUrl) {
    query.originalUrl = params.originalUrl;
  }

  if (params.shortUrl) {
    query.shortUrl = params.shortUrl;
  }

  return Url.findOne(query);
};

// Compare two object ids.
export const compareIds = (
  userId: Types.ObjectId,
  urlId: Types.ObjectId,
): boolean => {
  return urlId.equals(userId);
};

// Delete the document of provided Id.
export const deleteDocument = async <T>(
  id: Types.ObjectId,
  model: Model<T>,
): Promise<HydratedDocument<T> | null> => {
  const deletedDoc = await model.findByIdAndDelete(id);
  return deletedDoc;
};
