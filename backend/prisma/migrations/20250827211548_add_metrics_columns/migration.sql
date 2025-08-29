/*
  Warnings:

  - You are about to drop the column `10DayAverageTradingVolume` on the `Metrics` table. All the data in the column will be lost.
  - You are about to drop the column `52WeekHigh` on the `Metrics` table. All the data in the column will be lost.
  - You are about to drop the column `52WeekLow` on the `Metrics` table. All the data in the column will be lost.
  - You are about to drop the column `52WeekLowDate` on the `Metrics` table. All the data in the column will be lost.
  - You are about to drop the column `52WeekPriceReturnDaily` on the `Metrics` table. All the data in the column will be lost.
  - Added the required column `fiftyTwoWeekHigh` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fiftyTwoWeekLow` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fiftyTwoWeekLowDate` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fiftyTwoWeekPriceReturnDaily` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenDayAverageTradingVolume` to the `Metrics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Metrics" DROP COLUMN "10DayAverageTradingVolume",
DROP COLUMN "52WeekHigh",
DROP COLUMN "52WeekLow",
DROP COLUMN "52WeekLowDate",
DROP COLUMN "52WeekPriceReturnDaily",
ADD COLUMN     "fiftyTwoWeekHigh" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fiftyTwoWeekLow" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fiftyTwoWeekLowDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fiftyTwoWeekPriceReturnDaily" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tenDayAverageTradingVolume" DOUBLE PRECISION NOT NULL;
