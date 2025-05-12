/*
  Warnings:

  - You are about to drop the column `Mark_ID` on the `SoftSkillsTable` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SoftSkillsTable" DROP CONSTRAINT "SoftSkillsTable_Mark_ID_fkey";

-- AlterTable
ALTER TABLE "SoftSkillsTable" DROP COLUMN "Mark_ID",
ADD COLUMN     "softSkillsMarkId" INTEGER;

-- AddForeignKey
ALTER TABLE "SoftSkillsTable" ADD CONSTRAINT "SoftSkillsTable_softSkillsMarkId_fkey" FOREIGN KEY ("softSkillsMarkId") REFERENCES "SoftSkillsMarks"("Mark_ID") ON DELETE SET NULL ON UPDATE CASCADE;
