/*
  Warnings:

  - You are about to drop the column `insuranceCompanyName` on the `HousekeeperInformations` table. All the data in the column will be lost.
  - You are about to drop the column `sapNumber` on the `HousekeeperInformations` table. All the data in the column will be lost.
  - You are about to drop the column `societaryNumber` on the `HousekeeperInformations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `HousekeeperInformations` DROP COLUMN `insuranceCompanyName`,
    DROP COLUMN `sapNumber`,
    DROP COLUMN `societaryNumber`,
    ADD COLUMN `hasInsurance` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isDeclaredPersonalService` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `HousekeeperInsurance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `societaryNumber` VARCHAR(191) NULL,
    `insuranceCompanyName` VARCHAR(191) NULL,
    `housekeeperId` INTEGER NOT NULL,

    UNIQUE INDEX `HousekeeperInsurance_housekeeperId_key`(`housekeeperId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HousekeeperPersonalService` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sapNumber` VARCHAR(191) NULL,
    `housekeeperId` INTEGER NOT NULL,

    UNIQUE INDEX `HousekeeperPersonalService_housekeeperId_key`(`housekeeperId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HousekeeperInsurance` ADD CONSTRAINT `HousekeeperInsurance_housekeeperId_fkey` FOREIGN KEY (`housekeeperId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperPersonalService` ADD CONSTRAINT `HousekeeperPersonalService_housekeeperId_fkey` FOREIGN KEY (`housekeeperId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
