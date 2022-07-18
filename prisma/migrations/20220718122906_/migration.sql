-- AlterTable
ALTER TABLE `address` ADD COLUMN `stateId` INTEGER NULL,
    ADD COLUMN `zip` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `store` ADD COLUMN `status` VARCHAR(191) NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `storedetails` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `logo` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `storeUrlId` INTEGER NULL;

-- CreateTable
CREATE TABLE `State` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `State_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StoreUrl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `State`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StoreDetails` ADD CONSTRAINT `StoreDetails_storeUrlId_fkey` FOREIGN KEY (`storeUrlId`) REFERENCES `StoreUrl`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
