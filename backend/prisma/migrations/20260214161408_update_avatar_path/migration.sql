/*
  Warnings:

  - A unique constraint covering the columns `[avatarPath]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarPath" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "User_avatarPath_key" ON "User"("avatarPath");
