/*
  Warnings:

  - You are about to drop the column `currency_code` on the `Actif` table. All the data in the column will be lost.
  - Added the required column `change` to the `Actif` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Actif" DROP COLUMN "currency_code",
ADD COLUMN     "change" DOUBLE PRECISION NOT NULL;
