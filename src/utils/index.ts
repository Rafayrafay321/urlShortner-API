// Node modules
import mongoose from 'mongoose';
import type { HydratedDocument, Model } from 'mongoose';

// Custom Modules
import logger from '@/lib/winston';
import { prisma } from '@/config/prisma';
import { Url } from '@/models/url';
import { IUrl } from '@/models/url';
import { Prisma } from '@prisma/client';

// Types
type UrlQuery = {
  userId?: string;
  originalUrl?: string;
  shortUrl?: string;
};

type UserQuery = {
  id?: string;
  email?: string;
};

// Check for existence of User.
// TODO Do proper return type using ZOD

export const userExists = async (params: UserQuery) => {
  const condition: Prisma.UserWhereInput[] = [];

  if (params.id) condition.push({ id: params.id });
  if (params.email) condition.push({ email: params.email });
  if (condition.length === 0) return null;
  return prisma.user.findFirst({ where: { OR: condition } });
};

// Function returning whole document of the URL exisiting.
export const urlExists = async (
  params: UrlQuery,
): Promise<HydratedDocument<IUrl> | null> => {
  if (mongoose.connection.readyState !== 1) {
    logger.warn('Database not connected. Cannot check for the url existence', {
      params,
    });
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
export const compareIds = (userId: string, urlId: string): boolean => {
  return urlId === userId;
};

// Delete the document of provided Id.
export const deleteDocument = async <T>(
  id: string,
  model: Model<T>,
): Promise<HydratedDocument<T> | null> => {
  const deletedDoc = await model.findByIdAndDelete(id);
  return deletedDoc;
};
