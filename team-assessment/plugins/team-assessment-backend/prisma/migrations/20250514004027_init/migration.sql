-- DropForeignKey
ALTER TABLE "HardSkills" DROP CONSTRAINT "HardSkills_Mark_ID_fkey";

-- AddForeignKey
ALTER TABLE "HardSkills" ADD CONSTRAINT "HardSkills_Mark_ID_fkey" FOREIGN KEY ("Mark_ID") REFERENCES "HardSkillsMarks"("Mark_ID") ON DELETE CASCADE ON UPDATE CASCADE;
