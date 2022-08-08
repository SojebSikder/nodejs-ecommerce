-- AlterTable
ALTER TABLE `category` ADD COLUMN `categoryLink` VARCHAR(191) NULL,
    ADD COLUMN `parentId` INTEGER NULL,
    ADD COLUMN `sortOrder` INTEGER NULL;
