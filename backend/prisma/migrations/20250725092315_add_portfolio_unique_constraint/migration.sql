/*
  Warnings:

  - A unique constraint covering the columns `[portfolioId,actifId]` on the table `PortfolioActif` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PortfolioActif_portfolioId_actifId_key" ON "PortfolioActif"("portfolioId", "actifId");
