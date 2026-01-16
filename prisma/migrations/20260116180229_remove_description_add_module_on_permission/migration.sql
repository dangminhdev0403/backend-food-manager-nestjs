/*
  Warnings:

  - You are about to drop the column `description` on the `Permission` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Permission_method_path_idx";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "description",
ADD COLUMN     "module" VARCHAR(1000) NOT NULL DEFAULT 'Unknown';

-- CreateIndex
CREATE INDEX "Permission_method_path_module_idx" ON "Permission"("method", "path", "module");
