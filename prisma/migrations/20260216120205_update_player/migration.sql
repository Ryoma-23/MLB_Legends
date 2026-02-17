/*
  Warnings:

  - You are about to drop the column `name` on the `Player` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "name",
ADD COLUMN     "fullName" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "birthDate" DROP NOT NULL;
DROP SEQUENCE "Player_id_seq";
