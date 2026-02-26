-- CreateEnum
CREATE TYPE "FirstExecutionType" AS ENUM ('MONTH_START', 'MID_MONTH');

-- CreateEnum
CREATE TYPE "FrequencyType" AS ENUM ('WEEKLY', 'TWICE_BY_MONTH', 'MONTHLY', 'QUARTERLY');

-- CreateTable
CREATE TABLE "InvestmentPlans" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "assetId" INTEGER NOT NULL,
    "frequency" "FrequencyType" NOT NULL,
    "firstExecution" "FirstExecutionType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "InvestmentPlans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvestmentPlans" ADD CONSTRAINT "InvestmentPlans_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentPlans" ADD CONSTRAINT "InvestmentPlans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
