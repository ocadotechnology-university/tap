-- CreateTable
CREATE TABLE "LeaderAssessments" (
    "Assessment_ID" INTEGER NOT NULL,
    "Final_Soft_Mark_ID" INTEGER,
    "Final_Hard_Mark_ID" INTEGER,
    "Reviewed_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaderAssessments_pkey" PRIMARY KEY ("Assessment_ID")
);

-- AddForeignKey
ALTER TABLE "LeaderAssessments" ADD CONSTRAINT "LeaderAssessments_Assessment_ID_fkey" FOREIGN KEY ("Assessment_ID") REFERENCES "Assessments"("Assessment_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderAssessments" ADD CONSTRAINT "LeaderAssessments_Final_Soft_Mark_ID_fkey" FOREIGN KEY ("Final_Soft_Mark_ID") REFERENCES "SoftSkillsMarks"("Mark_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderAssessments" ADD CONSTRAINT "LeaderAssessments_Final_Hard_Mark_ID_fkey" FOREIGN KEY ("Final_Hard_Mark_ID") REFERENCES "HardSkillsMarks"("Mark_ID") ON DELETE SET NULL ON UPDATE CASCADE;
