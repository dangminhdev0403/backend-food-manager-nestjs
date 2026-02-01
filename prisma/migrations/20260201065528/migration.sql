/*
  Warnings:

  - You are about to drop the column `userId` on the `CategoryTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `cookingInstructions` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[categoryId,languageId]` on the table `CategoryTranslation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CategoryTranslation" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "cookingInstructions";

-- AlterTable
ALTER TABLE "ProductTranslation" ADD COLUMN     "cookingInstructions" VARCHAR(1000) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_categoryId_languageId_key" ON "CategoryTranslation"("categoryId", "languageId");
