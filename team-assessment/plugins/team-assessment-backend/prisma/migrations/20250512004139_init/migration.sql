/*
  Warnings:

  - You are about to drop the `Assessment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SoftSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SoftSkill" DROP CONSTRAINT "SoftSkill_assessmentId_fkey";

-- DropTable
DROP TABLE "Assessment";

-- DropTable
DROP TABLE "SoftSkill";

-- DropEnum
DROP TYPE "Level";

-- CreateTable
CREATE TABLE "Assessments" (
    "Assessment_ID" SERIAL NOT NULL,
    "createdBy" TEXT NOT NULL,
    "targetUser" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "GroupID" TEXT NOT NULL,

    CONSTRAINT "Assessments_pkey" PRIMARY KEY ("Assessment_ID")
);

-- CreateTable
CREATE TABLE "HardSkillsSections" (
    "Question_ID" INTEGER NOT NULL,
    "Text" TEXT NOT NULL,

    CONSTRAINT "HardSkillsSections_pkey" PRIMARY KEY ("Question_ID")
);

-- CreateTable
CREATE TABLE "HardSkillsMarks" (
    "Mark_ID" INTEGER NOT NULL,
    "Text" TEXT NOT NULL,

    CONSTRAINT "HardSkillsMarks_pkey" PRIMARY KEY ("Mark_ID")
);

-- CreateTable
CREATE TABLE "HardSkills" (
    "Assessment_ID" INTEGER NOT NULL,
    "Question_ID" INTEGER NOT NULL,
    "Mark_ID" INTEGER NOT NULL,

    CONSTRAINT "HardSkills_pkey" PRIMARY KEY ("Assessment_ID","Question_ID")
);

-- CreateTable
CREATE TABLE "Areas" (
    "Area_ID" INTEGER NOT NULL,
    "Text" TEXT NOT NULL,

    CONSTRAINT "Areas_pkey" PRIMARY KEY ("Area_ID")
);

-- CreateTable
CREATE TABLE "Competencies" (
    "Competency_ID" INTEGER NOT NULL,
    "Text" TEXT NOT NULL,

    CONSTRAINT "Competencies_pkey" PRIMARY KEY ("Competency_ID")
);

-- CreateTable
CREATE TABLE "SoftSkillsMarks" (
    "Mark_ID" INTEGER NOT NULL,
    "Text" TEXT NOT NULL,

    CONSTRAINT "SoftSkillsMarks_pkey" PRIMARY KEY ("Mark_ID")
);

-- CreateTable
CREATE TABLE "SoftSkillsTable" (
    "KEY" INTEGER NOT NULL,
    "Assessment_ID" INTEGER NOT NULL,
    "Area_ID" INTEGER NOT NULL,
    "Competency_ID" INTEGER NOT NULL,

    CONSTRAINT "SoftSkillsTable_pkey" PRIMARY KEY ("KEY")
);

-- CreateTable
CREATE TABLE "Comments" (
    "Comment_ID" INTEGER NOT NULL,
    "KEY" INTEGER NOT NULL,
    "Mark_ID" INTEGER NOT NULL,
    "Comment" TEXT NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("Comment_ID")
);

-- AddForeignKey
ALTER TABLE "HardSkills" ADD CONSTRAINT "HardSkills_Assessment_ID_fkey" FOREIGN KEY ("Assessment_ID") REFERENCES "Assessments"("Assessment_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HardSkills" ADD CONSTRAINT "HardSkills_Question_ID_fkey" FOREIGN KEY ("Question_ID") REFERENCES "HardSkillsSections"("Question_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HardSkills" ADD CONSTRAINT "HardSkills_Mark_ID_fkey" FOREIGN KEY ("Mark_ID") REFERENCES "HardSkillsMarks"("Mark_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftSkillsTable" ADD CONSTRAINT "SoftSkillsTable_Assessment_ID_fkey" FOREIGN KEY ("Assessment_ID") REFERENCES "Assessments"("Assessment_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftSkillsTable" ADD CONSTRAINT "SoftSkillsTable_Area_ID_fkey" FOREIGN KEY ("Area_ID") REFERENCES "Areas"("Area_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftSkillsTable" ADD CONSTRAINT "SoftSkillsTable_Competency_ID_fkey" FOREIGN KEY ("Competency_ID") REFERENCES "Competencies"("Competency_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_KEY_fkey" FOREIGN KEY ("KEY") REFERENCES "SoftSkillsTable"("KEY") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_Mark_ID_fkey" FOREIGN KEY ("Mark_ID") REFERENCES "SoftSkillsMarks"("Mark_ID") ON DELETE RESTRICT ON UPDATE CASCADE;
