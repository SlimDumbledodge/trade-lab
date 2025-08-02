/*
  Warnings:

  - You are about to drop the column `name` on the `Actif` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Actif` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[description]` on the table `Actif` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currency_code` to the `Actif` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_price` to the `Actif` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Actif` table without a default value. This is not possible if the table is not empty.
  - Added the required column `highest_price_day` to the `Actif` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lowest_price_day` to the `Actif` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opening_price_day` to the `Actif` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percent_change` to the `Actif` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previous_close_price_day` to the `Actif` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Actif` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Actif_name_key";

-- AlterTable
ALTER TABLE "Actif" DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "currency_code" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "current_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "highest_price_day" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lowest_price_day" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "opening_price_day" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "percent_change" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "previous_close_price_day" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Actif_description_key" ON "Actif"("description");
