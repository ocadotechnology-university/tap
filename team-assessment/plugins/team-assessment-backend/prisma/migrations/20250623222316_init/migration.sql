/*
  Warnings:

  - You are about to drop the column `Final_Hard_Mark_ID` on the `LeaderAssessments` table. All the data in the column will be lost.
  - You are about to drop the column `Final_Soft_Mark_ID` on the `LeaderAssessments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LeaderAssessments" DROP CONSTRAINT "LeaderAssessments_Final_Hard_Mark_ID_fkey";

-- DropForeignKey
ALTER TABLE "LeaderAssessments" DROP CONSTRAINT "LeaderAssessments_Final_Soft_Mark_ID_fkey";

-- AlterTable
ALTER TABLE "LeaderAssessments" DROP COLUMN "Final_Hard_Mark_ID",
DROP COLUMN "Final_Soft_Mark_ID",
ADD COLUMN     "Final_Hard_Decision" TEXT,
ADD COLUMN     "Final_Soft_Decision" TEXT;
