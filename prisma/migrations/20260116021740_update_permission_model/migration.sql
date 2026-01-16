/*
  Warnings:

  - You are about to drop the column `createdById` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `updatedById` on the `Permission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[method,path]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_updatedById_fkey";

-- DropIndex
DROP INDEX "Permission_deletedAt_idx";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "createdById",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedById";

-- CreateIndex
CREATE INDEX "Permission_method_path_idx" ON "Permission"("method", "path");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_method_path_key" ON "Permission"("method", "path");
