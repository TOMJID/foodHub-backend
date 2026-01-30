-- DropForeignKey
ALTER TABLE "meal" DROP CONSTRAINT "meal_providerId_fkey";

-- AlterTable
ALTER TABLE "meal" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
