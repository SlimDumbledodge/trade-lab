/*
  Warnings:

  - You are about to drop the `PortfolioHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PortfolioHistory" DROP CONSTRAINT "PortfolioHistory_portfolioId_fkey";

-- DropTable
DROP TABLE "PortfolioHistory";

-- CreateTable
CREATE TABLE "PortfolioSnapshots" (
    "id" SERIAL NOT NULL,
    "portfolioId" INTEGER NOT NULL,
    "holdingsValue" DECIMAL(65,30) NOT NULL,
    "cashBalance" DECIMAL(65,30) NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioSnapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PortfolioSnapshots_portfolioId_recordedAt_idx" ON "PortfolioSnapshots"("portfolioId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioSnapshots_portfolioId_recordedAt_key" ON "PortfolioSnapshots"("portfolioId", "recordedAt");

-- AddForeignKey
ALTER TABLE "PortfolioSnapshots" ADD CONSTRAINT "PortfolioSnapshots_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
