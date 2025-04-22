-- CreateEnum
CREATE TYPE "Level" AS ENUM ('BAR', 'EXCELLENT', 'LEADING');

-- CreateTable
CREATE TABLE "Assessment" (
    "id" SERIAL NOT NULL,
    "groupId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "targetUser" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoftSkill" (
    "id" SERIAL NOT NULL,
    "assessmentId" INTEGER NOT NULL,
    "area" TEXT NOT NULL,
    "competency" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "comments" TEXT[],

    CONSTRAINT "SoftSkill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SoftSkill" ADD CONSTRAINT "SoftSkill_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
