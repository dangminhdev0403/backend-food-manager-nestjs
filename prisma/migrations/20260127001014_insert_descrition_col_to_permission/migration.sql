/*
  Warnings:

  - You are about to drop the column `description` on the `RolePermission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "description" VARCHAR(500) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "description";
