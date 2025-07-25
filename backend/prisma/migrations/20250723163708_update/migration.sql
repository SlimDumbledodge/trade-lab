/*
  Warnings:

  - You are about to drop the column `balance` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 100000;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "balance";
