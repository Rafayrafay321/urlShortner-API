/*
  Warnings:

  - A unique constraint covering the columns `[passwordResetTokenHash]` on the table `PasswordResetToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_passwordResetTokenHash_key" ON "PasswordResetToken"("passwordResetTokenHash");
