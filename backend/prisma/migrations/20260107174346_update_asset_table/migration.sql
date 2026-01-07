/*
  Warnings:

  - You are about to drop the column `description` on the `Asset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "description",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "logo" TEXT NOT NULL DEFAULT '';
