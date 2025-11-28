/*
  Warnings:

  - You are about to drop the column `totalValue` on the `PortfolioHistory` table. All the data in the column will be lost.
  - Added the required column `realizedPnL` to the `PortfolioHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "realizedPnL" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PortfolioHistory" DROP COLUMN "totalValue",
ADD COLUMN     "realizedPnL" DECIMAL(65,30) NOT NULL;
