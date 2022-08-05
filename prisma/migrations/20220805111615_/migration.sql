/*
  Warnings:

  - You are about to drop the column `bio` on the `profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profile` DROP COLUMN `bio`,
    ADD COLUMN `dateOfBirth` DATETIME(3) NULL,
    ADD COLUMN `gender` VARCHAR(191) NULL,
    ADD COLUMN `mobile` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ucode` ADD COLUMN `dateExpired` DATETIME(3) NULL;
