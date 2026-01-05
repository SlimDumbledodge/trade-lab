/*
  Warnings:

  - A unique constraint covering the columns `[assetId,timeframe,recordedAt]` on the table `AssetPrice` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AssetPrice_assetId_recordedAt_key";

-- CreateIndex
CREATE UNIQUE INDEX "AssetPrice_assetId_timeframe_recordedAt_key" ON "AssetPrice"("assetId", "timeframe", "recordedAt");
