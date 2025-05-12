/*
  Warnings:

  - You are about to drop the column `descrione` on the `Citta` table. All the data in the column will be lost.
  - Added the required column `descrizione` to the `Citta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Citta" DROP COLUMN "descrione",
ADD COLUMN     "descrizione" TEXT NOT NULL;
