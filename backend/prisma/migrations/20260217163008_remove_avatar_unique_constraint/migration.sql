-- DropIndex
DROP INDEX "User_avatarPath_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatarPath" DROP NOT NULL,
ALTER COLUMN "avatarPath" DROP DEFAULT;
