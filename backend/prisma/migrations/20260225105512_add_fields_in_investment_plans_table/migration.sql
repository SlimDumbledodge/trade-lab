/*
  Warnings:

  - Added the required column `isFirstExecution` to the `InvestmentPlans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextExecutionAt` to the `InvestmentPlans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvestmentPlans" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isFirstExecution" BOOLEAN NOT NULL,
ADD COLUMN     "nextExecutionAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
