/*
  Warnings:

  - You are about to drop the column `storeDetailsId` on the `store` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `store` DROP FOREIGN KEY `Store_storeDetailsId_fkey`;

-- AlterTable
ALTER TABLE `store` DROP COLUMN `storeDetailsId`;

-- AlterTable
ALTER TABLE `storedetails` ADD COLUMN `storeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `StoreDetails` ADD CONSTRAINT `StoreDetails_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
