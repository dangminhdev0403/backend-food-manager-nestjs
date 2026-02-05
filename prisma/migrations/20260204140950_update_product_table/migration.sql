/*
  Warnings:

  - A unique constraint covering the columns `[productId,languageId]` on the table `ProductTranslation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductTranslation_productId_languageId_key" ON "ProductTranslation"("productId", "languageId");
