-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('LIMIT', 'STOP');

-- CreateEnum
CREATE TYPE "OrderAction" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('ACTIVE', 'TRIGGERED', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "assetId" INTEGER NOT NULL,
    "type" "OrderType" NOT NULL,
    "action" "OrderAction" NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'ACTIVE',
    "quantity" DECIMAL(65,30) NOT NULL,
    "targetPrice" DECIMAL(65,30) NOT NULL,
    "triggeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order_userId_status_idx" ON "Order"("userId", "status");

-- CreateIndex
CREATE INDEX "Order_status_type_idx" ON "Order"("status", "type");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
