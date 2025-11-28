/*
  Warnings:

  - You are about to drop the column `realizedPnL` on the `PortfolioHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PortfolioHistory" DROP COLUMN "realizedPnL",
ADD COLUMN     "unrealizedPnL" DECIMAL(65,30) NOT NULL DEFAULT 0;
