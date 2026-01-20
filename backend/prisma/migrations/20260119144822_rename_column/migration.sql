/*
  Warnings:

  - You are about to drop the column `holdingsValue` on the `PortfolioAsset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PortfolioAsset" DROP COLUMN "holdingsValue",
ADD COLUMN     "holdingValue" DECIMAL(65,30) NOT NULL DEFAULT 0;
