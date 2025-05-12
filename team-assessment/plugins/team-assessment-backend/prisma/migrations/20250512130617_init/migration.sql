/*
  Warnings:

  - A unique constraint covering the columns `[Text]` on the table `Areas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Text]` on the table `SoftSkillsMarks` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE areas_area_id_seq;
ALTER TABLE "Areas" ALTER COLUMN "Area_ID" SET DEFAULT nextval('areas_area_id_seq');
ALTER SEQUENCE areas_area_id_seq OWNED BY "Areas"."Area_ID";

-- AlterTable
CREATE SEQUENCE softskillsmarks_mark_id_seq;
ALTER TABLE "SoftSkillsMarks" ALTER COLUMN "Mark_ID" SET DEFAULT nextval('softskillsmarks_mark_id_seq');
ALTER SEQUENCE softskillsmarks_mark_id_seq OWNED BY "SoftSkillsMarks"."Mark_ID";

-- CreateIndex
CREATE UNIQUE INDEX "Areas_Text_key" ON "Areas"("Text");

-- CreateIndex
CREATE UNIQUE INDEX "SoftSkillsMarks_Text_key" ON "SoftSkillsMarks"("Text");
