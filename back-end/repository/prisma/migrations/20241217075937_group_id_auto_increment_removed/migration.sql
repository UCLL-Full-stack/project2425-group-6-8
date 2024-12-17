/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Group_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Group_id_key" ON "Group"("id");
