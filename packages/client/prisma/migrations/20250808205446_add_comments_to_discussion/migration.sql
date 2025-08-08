/*
  Warnings:

  - You are about to drop the column `author` on the `Discussion` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Discussion` table without a default value. This is not possible if the table is not empty.

*/

-- First, add the authorId column with a default value
ALTER TABLE "Discussion" ADD COLUMN "authorId" INTEGER;

-- Update existing rows to have a valid authorId (assuming user with id=1 exists)
UPDATE "Discussion" SET "authorId" = 1 WHERE "authorId" IS NULL;

-- Now make the column NOT NULL and drop the old author column
ALTER TABLE "Discussion" ALTER COLUMN "authorId" SET NOT NULL,
DROP COLUMN "author";

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "discussionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
