/*
  Warnings:

  - You are about to drop the column `groceryListId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `messageId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "groceryListId",
DROP COLUMN "messageId",
DROP COLUMN "scheduleId",
DROP COLUMN "userId";
