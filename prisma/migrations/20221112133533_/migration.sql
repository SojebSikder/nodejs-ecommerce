-- DropForeignKey
ALTER TABLE `suborder` DROP FOREIGN KEY `SubOrder_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `suborder` DROP FOREIGN KEY `SubOrder_sellerId_fkey`;

-- AlterTable
ALTER TABLE `suborder` ADD COLUMN `shopId` INTEGER NULL,
    MODIFY `orderId` VARCHAR(191) NULL,
    MODIFY `sellerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `SubOrder` ADD CONSTRAINT `SubOrder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`orderId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubOrder` ADD CONSTRAINT `SubOrder_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubOrder` ADD CONSTRAINT `SubOrder_shopId_fkey` FOREIGN KEY (`shopId`) REFERENCES `Shop`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
