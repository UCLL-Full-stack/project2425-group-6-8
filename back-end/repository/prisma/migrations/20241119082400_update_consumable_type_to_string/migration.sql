/*
  Warnings:

  - Changed the type of `consumableType` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "description" DROP NOT NULL,
DROP COLUMN "consumableType",
ADD COLUMN     "consumableType" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "weight" SET DATA TYPE DOUBLE PRECISION;
