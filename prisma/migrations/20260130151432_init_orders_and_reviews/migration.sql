/*
  Warnings:

  - You are about to drop the column `userId` on the `meal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "meal" DROP CONSTRAINT "meal_userId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_providerId_fkey";

-- AlterTable
ALTER TABLE "meal" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
