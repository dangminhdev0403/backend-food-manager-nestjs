/*
  Warnings:

  - You are about to drop the column `images` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ImageStatus" AS ENUM ('TEMP', 'ACTIVE', 'DELETED');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "images";

-- CreateTable
CREATE TABLE "ImageProduct" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "status" "ImageStatus" NOT NULL DEFAULT 'TEMP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "productId" INTEGER,

    CONSTRAINT "ImageProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImageProduct_productId_idx" ON "ImageProduct"("productId");

-- AddForeignKey
ALTER TABLE "ImageProduct" ADD CONSTRAINT "ImageProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
