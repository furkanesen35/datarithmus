/*
  Warnings:

  - You are about to drop the column `tempPassword` on the `EmailVerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `tempPassword` on the `PasswordResetToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmailVerificationToken" DROP COLUMN "tempPassword";

-- AlterTable
ALTER TABLE "PasswordResetToken" DROP COLUMN "tempPassword";
