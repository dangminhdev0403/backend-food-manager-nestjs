/*
  Warnings:

  - You are about to drop the column `parentCategoryId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `base_price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `brandId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `virtual_price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BrandTranslation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `basePrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `virtualPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "BrandTranslation" DROP CONSTRAINT "BrandTranslation_brandId_fkey";

-- DropForeignKey
ALTER TABLE "BrandTranslation" DROP CONSTRAINT "BrandTranslation_createdById_fkey";

-- DropForeignKey
ALTER TABLE "BrandTranslation" DROP CONSTRAINT "BrandTranslation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "BrandTranslation" DROP CONSTRAINT "BrandTranslation_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_updatedById_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "parentCategoryId",
ADD COLUMN     "parentId" INTEGER;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "base_price",
DROP COLUMN "brandId",
DROP COLUMN "virtual_price",
ADD COLUMN     "basePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "cookingInstructions" VARCHAR(1000) NOT NULL DEFAULT '',
ADD COLUMN     "ownerId" INTEGER NOT NULL,
ADD COLUMN     "virtualPrice" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Brand";

-- DropTable
DROP TABLE "BrandTranslation";

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
