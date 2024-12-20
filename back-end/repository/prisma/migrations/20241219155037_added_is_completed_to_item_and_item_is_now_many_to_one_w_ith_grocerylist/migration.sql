/*
  Warnings:

  - You are about to drop the `_ItemGroceryLists` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `consumableType` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_ItemGroceryLists" DROP CONSTRAINT "_ItemGroceryLists_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemGroceryLists" DROP CONSTRAINT "_ItemGroceryLists_B_fkey";

-- DropIndex
DROP INDEX "Group_id_key";

-- AlterTable
CREATE SEQUENCE group_id_seq;
ALTER TABLE "Group" ALTER COLUMN "id" SET DEFAULT nextval('group_id_seq');
ALTER SEQUENCE group_id_seq OWNED BY "Group"."id";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "groceryListId" INTEGER,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "consumableType",
ADD COLUMN     "consumableType" "consumableTypeEnum" NOT NULL;

-- DropTable
DROP TABLE "_ItemGroceryLists";

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_groceryListId_fkey" FOREIGN KEY ("groceryListId") REFERENCES "GroceryList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
