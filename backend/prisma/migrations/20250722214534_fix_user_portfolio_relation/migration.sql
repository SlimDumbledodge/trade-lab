/*
  Warnings:

  - You are about to drop the column `portfolioId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_portfolioId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "portfolioId";
