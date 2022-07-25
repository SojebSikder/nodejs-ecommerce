/*
  Warnings:

  - You are about to drop the `storeorder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_storeOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `storeorder` DROP FOREIGN KEY `StoreOrder_addressId_fkey`;

-- DropForeignKey
ALTER TABLE `storeorder` DROP FOREIGN KEY `StoreOrder_paymentDetailsId_fkey`;

-- DropForeignKey
ALTER TABLE `storeorder` DROP FOREIGN KEY `StoreOrder_storeId_fkey`;

-- DropForeignKey
ALTER TABLE `storeorder` DROP FOREIGN KEY `StoreOrder_userId_fkey`;

-- DropForeignKey
ALTER TABLE `storeorder` DROP FOREIGN KEY `StoreOrder_userOrderId_fkey`;

-- DropTable
DROP TABLE `storeorder`;

-- CreateTable
CREATE TABLE `VendorOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `orderId` VARCHAR(191) NOT NULL,
    `orderItemId` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `delivery_fee` VARCHAR(191) NULL,
    `discount` VARCHAR(191) NULL,
    `total` VARCHAR(191) NOT NULL,
    `paymentMode` VARCHAR(191) NOT NULL,
    `paymentStatus` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL,
    `comment` VARCHAR(191) NULL,
    `addressId` INTEGER NULL,
    `userId` INTEGER NULL,
    `paymentDetailsId` INTEGER NULL,
    `storeId` INTEGER NULL,
    `storeDetailsId` INTEGER NULL,
    `userOrderId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VendorOrder` ADD CONSTRAINT `VendorOrder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorOrder` ADD CONSTRAINT `VendorOrder_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorOrder` ADD CONSTRAINT `VendorOrder_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorOrder` ADD CONSTRAINT `VendorOrder_userOrderId_fkey` FOREIGN KEY (`userOrderId`) REFERENCES `Order`(`orderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorOrder` ADD CONSTRAINT `VendorOrder_paymentDetailsId_fkey` FOREIGN KEY (`paymentDetailsId`) REFERENCES `PaymentDetails`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_storeOrderId_fkey` FOREIGN KEY (`storeOrderId`) REFERENCES `VendorOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
