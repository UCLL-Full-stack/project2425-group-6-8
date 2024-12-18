/*
  Warnings:

  - You are about to drop the `GroceryListItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroceryListItem" DROP CONSTRAINT "GroceryListItem_groceryListId_fkey";

-- DropForeignKey
ALTER TABLE "GroceryListItem" DROP CONSTRAINT "GroceryListItem_itemId_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "quantity" DOUBLE PRECISION,
ADD COLUMN     "weight" INTEGER;

-- DropTable
DROP TABLE "GroceryListItem";

-- CreateTable
CREATE TABLE "_ItemGroceryLists" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ItemGroceryLists_AB_unique" ON "_ItemGroceryLists"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemGroceryLists_B_index" ON "_ItemGroceryLists"("B");

-- AddForeignKey
ALTER TABLE "_ItemGroceryLists" ADD CONSTRAINT "_ItemGroceryLists_A_fkey" FOREIGN KEY ("A") REFERENCES "GroceryList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemGroceryLists" ADD CONSTRAINT "_ItemGroceryLists_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
