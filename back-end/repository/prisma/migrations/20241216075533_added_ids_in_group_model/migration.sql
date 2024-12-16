/*
  Warnings:

  - Added the required column `groceryListId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "groceryListId" INTEGER NOT NULL,
ADD COLUMN     "messageId" INTEGER NOT NULL,
ADD COLUMN     "scheduleId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;
