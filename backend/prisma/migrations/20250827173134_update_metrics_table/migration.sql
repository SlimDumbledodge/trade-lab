/*
  Warnings:

  - You are about to drop the column `fiftyTwoWeekHigh` on the `Metrics` table. All the data in the column will be lost.
  - You are about to drop the column `fiftyTwoWeekLow` on the `Metrics` table. All the data in the column will be lost.
  - You are about to drop the column `fiftyTwoWeekLowDate` on the `Metrics` table. All the data in the column will be lost.
  - You are about to drop the column `fiftyTwoWeekPriceReturnDaily` on the `Metrics` table. All the data in the column will be lost.
  - You are about to drop the column `metricType` on the `Metrics` table. All the data in the column will be lost.
  - You are about to drop the column `tenDayAverageTradingVolume` on the `Metrics` table. All the data in the column will be lost.
  - Added the required column `10DayAverageTradingVolume` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `52WeekHigh` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `52WeekLow` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `52WeekLowDate` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `52WeekPriceReturnDaily` to the `Metrics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Metrics" DROP COLUMN "fiftyTwoWeekHigh",
DROP COLUMN "fiftyTwoWeekLow",
DROP COLUMN "fiftyTwoWeekLowDate",
DROP COLUMN "fiftyTwoWeekPriceReturnDaily",
DROP COLUMN "metricType",
DROP COLUMN "tenDayAverageTradingVolume",
ADD COLUMN     "10DayAverageTradingVolume" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "52WeekHigh" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "52WeekLow" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "52WeekLowDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "52WeekPriceReturnDaily" DOUBLE PRECISION NOT NULL;
