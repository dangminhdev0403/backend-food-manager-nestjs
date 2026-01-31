/*
  Warnings:

  - You are about to drop the column `parentId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "CategoryTranslation" DROP CONSTRAINT "CategoryTranslation_createdById_fkey";

-- DropForeignKey
ALTER TABLE "CategoryTranslation" DROP CONSTRAINT "CategoryTranslation_updatedById_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "parentId",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "CategoryTranslation" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
