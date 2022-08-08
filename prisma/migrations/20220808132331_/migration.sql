-- DropForeignKey
ALTER TABLE `shopdetails` DROP FOREIGN KEY `ShopDetails_addressId_fkey`;

-- DropForeignKey
ALTER TABLE `shopdetails` DROP FOREIGN KEY `ShopDetails_shopId_fkey`;

-- DropForeignKey
ALTER TABLE `shopdetails` DROP FOREIGN KEY `ShopDetails_shopUrlId_fkey`;

-- AddForeignKey
ALTER TABLE `ShopDetails` ADD CONSTRAINT `ShopDetails_shopId_fkey` FOREIGN KEY (`shopId`) REFERENCES `Shop`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShopDetails` ADD CONSTRAINT `ShopDetails_shopUrlId_fkey` FOREIGN KEY (`shopUrlId`) REFERENCES `ShopUrl`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShopDetails` ADD CONSTRAINT `ShopDetails_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
