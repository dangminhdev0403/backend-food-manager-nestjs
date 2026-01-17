-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- CreateTable
CREATE TABLE "user_has_role" (
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "user_has_role_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateIndex
CREATE INDEX "user_has_role_roleId_idx" ON "user_has_role"("roleId");

-- AddForeignKey
ALTER TABLE "user_has_role" ADD CONSTRAINT "user_has_role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_has_role" ADD CONSTRAINT "user_has_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
