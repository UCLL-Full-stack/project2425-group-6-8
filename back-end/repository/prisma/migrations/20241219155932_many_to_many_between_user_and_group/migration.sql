/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_UserGroups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserGroups" DROP CONSTRAINT "_UserGroups_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserGroups" DROP CONSTRAINT "_UserGroups_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- DropTable
DROP TABLE "_UserGroups";

-- CreateTable
CREATE TABLE "UserGroup" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGroup_userId_groupId_key" ON "UserGroup"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
