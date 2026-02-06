/*
  Warnings:

  - You are about to drop the column `code` on the `Table` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Table_code_key";

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "code";
