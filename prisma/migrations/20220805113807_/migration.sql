-- AlterTable
ALTER TABLE `profile` ADD COLUMN `addressId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
