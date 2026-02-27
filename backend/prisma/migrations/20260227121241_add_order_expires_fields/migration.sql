/*
  Warnings:

  - Added the required column `expiresAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresType` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderExpiresType" AS ENUM ('DAY', 'YEAR');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'ORDER';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "expiresType" "OrderExpiresType" NOT NULL;
