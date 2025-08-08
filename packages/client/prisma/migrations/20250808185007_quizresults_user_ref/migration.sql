-- DropForeignKey
ALTER TABLE "QuizResults" DROP CONSTRAINT "QuizResults_studentId_fkey";

-- AddForeignKey
ALTER TABLE "QuizResults" ADD CONSTRAINT "QuizResults_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
