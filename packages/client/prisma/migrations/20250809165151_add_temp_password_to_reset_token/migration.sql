/*
  Warnings:

  - Added the required column `tempPassword` to the `PasswordResetToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PasswordResetToken" ADD COLUMN     "tempPassword" TEXT NOT NULL;
