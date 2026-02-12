// Node modules

import type { HydratedDocument, Model } from 'mongoose';

// Custom Modules

import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';

// Types
type UrlQuery = {
  userId?: string;
  orignalUrl?: string;
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

// Check for existence of url.
// TODO Do proper return type using ZOD
export const urlExists = async (params: UrlQuery) => {
  const condition: Prisma.UrlWhereInput[] = [];

  if (params.shortUrl) condition.push({ shortUrl: params.shortUrl });
  if (params.orignalUrl) condition.push({ orignalUrl: params.orignalUrl });
  if (condition.length === 0) return null;
  return prisma.url.findFirst({
    where: {
      userId: params.userId,
      OR: condition,
    },
  });
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
