/*
  Warnings:

  - Made the column `description` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL;