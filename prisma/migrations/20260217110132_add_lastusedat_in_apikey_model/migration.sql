/*
  Warnings:

  - Added the required column `lastUsedAt` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "lastUsedAt" TIMESTAMP(3) NOT NULL;
