-- CreateTable
CREATE TABLE "public"."Metrics" (
    "id" SERIAL NOT NULL,
    "metricType" TEXT NOT NULL,
    "tenDayAverageTradingVolume" DOUBLE PRECISION NOT NULL,
    "fiftyTwoWeekHigh" DOUBLE PRECISION NOT NULL,
    "fiftyTwoWeekLow" DOUBLE PRECISION NOT NULL,
    "fiftyTwoWeekLowDate" TIMESTAMP(3) NOT NULL,
    "fiftyTwoWeekPriceReturnDaily" DOUBLE PRECISION NOT NULL,
    "beta" DOUBLE PRECISION NOT NULL,
    "actifId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metrics_actifId_key" ON "public"."Metrics"("actifId");

-- AddForeignKey
ALTER TABLE "public"."Metrics" ADD CONSTRAINT "Metrics_actifId_fkey" FOREIGN KEY ("actifId") REFERENCES "public"."Actif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
