-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_authorId_fkey`;

-- AlterTable
ALTER TABLE `category` MODIFY `authorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
