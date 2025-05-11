-- AlterEnum
ALTER TYPE "Level" ADD VALUE 'DEVELOPMENT_NEED';

-- CreateTable
CREATE TABLE "HardSkill" (
    "id" SERIAL NOT NULL,
    "assessmentId" INTEGER NOT NULL,
    "area" TEXT NOT NULL,
    "competency" TEXT NOT NULL,
    "level" "Level" NOT NULL,

    CONSTRAINT "HardSkill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HardSkill" ADD CONSTRAINT "HardSkill_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
