/*
  Warnings:

  - You are about to drop the column `date` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `end` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;
