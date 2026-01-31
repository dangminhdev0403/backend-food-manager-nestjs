-- CreateIndex
CREATE INDEX "Category_deletedAt_idx" ON "Category"("deletedAt");

CREATE UNIQUE INDEX "categoryTranslation_categoryId_languageId_unique" ON "CategoryTranslation" ("categoryId","languageId") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "productTranslation_productId_languageId_unique" ON "ProductTranslation" ("productId","languageId") WHERE "deletedAt" IS NULL;