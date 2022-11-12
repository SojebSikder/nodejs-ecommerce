-- AlterTable
ALTER TABLE `optionset` ADD COLUMN `shopId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `OptionSet` ADD CONSTRAINT `OptionSet_shopId_fkey` FOREIGN KEY (`shopId`) REFERENCES `Shop`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
