/*
  Warnings:

  - Added the required column `productName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "productName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "OrderItemTranslation" (
    "id" SERIAL NOT NULL,
    "orderItemId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(500) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "OrderItemTranslation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItemTranslation" ADD CONSTRAINT "OrderItemTranslation_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrderItemTranslation" ADD CONSTRAINT "OrderItemTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
