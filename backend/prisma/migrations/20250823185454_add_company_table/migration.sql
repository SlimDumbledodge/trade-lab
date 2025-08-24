-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "ticker" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "marketEntryDate" TIMESTAMP(3) NOT NULL,
    "marketCapitalization" DOUBLE PRECISION,
    "sharesOutstanding" DOUBLE PRECISION,
    "phone" TEXT,
    "webUrl" TEXT,
    "logo" TEXT,
    "industry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_ticker_key" ON "Company"("ticker");
