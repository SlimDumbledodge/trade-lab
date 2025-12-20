/*
  Warnings:

  - You are about to drop the column `price` on the `AssetPrice` table. All the data in the column will be lost.
  - Added the required column `close` to the `AssetPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `high` to the `AssetPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `low` to the `AssetPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `open` to the `AssetPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeframe` to the `AssetPrice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TimeframeType" AS ENUM ('ONE_MIN', 'ONE_HOUR', 'ONE_DAY', 'ONE_WEEK', 'ONE_MONTH');

-- AlterTable
ALTER TABLE "AssetPrice" DROP COLUMN "price",
ADD COLUMN     "close" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "high" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "low" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "open" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "timeframe" TEXT NOT NULL,
ADD COLUMN     "volume" DECIMAL(65,30);
