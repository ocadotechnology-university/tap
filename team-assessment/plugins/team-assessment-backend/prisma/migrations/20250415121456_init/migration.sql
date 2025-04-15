/*
  Warnings:

  - Added the required column `groupId` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetUser` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Level" AS ENUM ('BAR', 'EXCELLENT', 'LEADING');

-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "targetUser" TEXT NOT NULL;

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
