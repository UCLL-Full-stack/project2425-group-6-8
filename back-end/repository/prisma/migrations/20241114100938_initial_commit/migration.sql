/*
  Warnings:

  - You are about to drop the column `price` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_groceryListId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "price",
ALTER COLUMN "groceryListId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_groceryListId_fkey" FOREIGN KEY ("groceryListId") REFERENCES "GroceryList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
