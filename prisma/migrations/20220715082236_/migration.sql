/*
  Warnings:

  - You are about to alter the column `price` on the `order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `price` on the `orderitem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `price` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orderitem` MODIFY `price` INTEGER NOT NULL;
