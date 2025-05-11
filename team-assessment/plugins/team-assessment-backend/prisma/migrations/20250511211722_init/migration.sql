/*
  Warnings:

  - Changed the type of `GroupID` on the `Assessments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "HardSkills" DROP CONSTRAINT "HardSkills_Assessment_ID_fkey";

-- DropForeignKey
ALTER TABLE "HardSkills" DROP CONSTRAINT "HardSkills_Question_ID_fkey";

-- DropForeignKey
ALTER TABLE "SoftSkillsTable" DROP CONSTRAINT "SoftSkillsTable_Assessment_ID_fkey";

-- DropIndex
DROP INDEX "SoftSkillsTable_Assessment_ID_Area_ID_Competency_ID_key";

-- AlterTable
ALTER TABLE "Assessments" ALTER COLUMN "Assessment_ID" DROP DEFAULT,
DROP COLUMN "GroupID",
ADD COLUMN     "GroupID" INTEGER NOT NULL;
DROP SEQUENCE "Assessments_Assessment_ID_seq";

-- AlterTable
ALTER TABLE "Comments" ALTER COLUMN "Comment_ID" DROP DEFAULT;
DROP SEQUENCE "Comments_Comment_ID_seq";

-- CreateTable
CREATE TABLE "HardSkillsSections" (
    "Question_ID" INTEGER NOT NULL,
    "Text" TEXT NOT NULL,

    CONSTRAINT "HardSkillsSections_pkey" PRIMARY KEY ("Question_ID")
);

-- AddForeignKey
ALTER TABLE "HardSkills" ADD CONSTRAINT "HardSkills_Assessment_ID_fkey" FOREIGN KEY ("Assessment_ID") REFERENCES "Assessments"("Assessment_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HardSkills" ADD CONSTRAINT "HardSkills_Question_ID_fkey" FOREIGN KEY ("Question_ID") REFERENCES "HardSkillsSections"("Question_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftSkillsTable" ADD CONSTRAINT "SoftSkillsTable_Assessment_ID_fkey" FOREIGN KEY ("Assessment_ID") REFERENCES "Assessments"("Assessment_ID") ON DELETE RESTRICT ON UPDATE CASCADE;
