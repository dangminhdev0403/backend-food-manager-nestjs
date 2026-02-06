/*
  Warnings:

  - Added the required column `source` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderSource" AS ENUM ('GUEST_QR', 'USER_REMOTE');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "guestName" TEXT,
ADD COLUMN     "source" "OrderSource" NOT NULL,
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
