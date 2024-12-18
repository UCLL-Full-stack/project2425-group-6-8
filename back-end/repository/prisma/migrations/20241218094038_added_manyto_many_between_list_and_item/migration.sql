/*
  Warnings:

  - You are about to drop the column `groceryListId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_groceryListId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "groceryListId",
DROP COLUMN "quantity",
DROP COLUMN "weight",
ALTER COLUMN "price" DROP NOT NULL;

-- CreateTable
CREATE TABLE "GroceryListItem" (
    "id" SERIAL NOT NULL,
    "groceryListId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER,
    "weight" DOUBLE PRECISION,

    CONSTRAINT "GroceryListItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroceryListItem" ADD CONSTRAINT "GroceryListItem_groceryListId_fkey" FOREIGN KEY ("groceryListId") REFERENCES "GroceryList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroceryListItem" ADD CONSTRAINT "GroceryListItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
