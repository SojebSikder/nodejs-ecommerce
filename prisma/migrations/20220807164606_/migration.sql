/*
  Warnings:

  - Added the required column `authorId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `authorId` INTEGER NOT NULL,
    ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
