-- CreateEnum
CREATE TYPE "RoleUser" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "SubscriptionUser" AS ENUM ('free', 'premium');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "RoleUser" NOT NULL DEFAULT 'admin',
    "subscription" "SubscriptionUser" NOT NULL DEFAULT 'free',
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 100000,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
