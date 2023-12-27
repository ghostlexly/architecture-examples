/*
  Warnings:

  - You are about to drop the `HousekeeperInformations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HousekeepersOnServices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `HousekeeperAvatar` DROP FOREIGN KEY `HousekeeperAvatar_informationsId_fkey`;

-- DropForeignKey
ALTER TABLE `HousekeeperDocument` DROP FOREIGN KEY `HousekeeperDocument_informationsId_fkey`;

-- DropForeignKey
ALTER TABLE `HousekeeperGeographicalArea` DROP FOREIGN KEY `HousekeeperGeographicalArea_informationsId_fkey`;

-- DropForeignKey
ALTER TABLE `HousekeeperInformations` DROP FOREIGN KEY `HousekeeperInformations_companyAddressId_fkey`;

-- DropForeignKey
ALTER TABLE `HousekeeperInformations` DROP FOREIGN KEY `HousekeeperInformations_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `HousekeeperInsurance` DROP FOREIGN KEY `HousekeeperInsurance_informationsId_fkey`;

-- DropForeignKey
ALTER TABLE `HousekeeperPersonalService` DROP FOREIGN KEY `HousekeeperPersonalService_informationsId_fkey`;

-- DropForeignKey
ALTER TABLE `HousekeepersOnServices` DROP FOREIGN KEY `HousekeepersOnServices_informationsId_fkey`;

-- DropForeignKey
ALTER TABLE `HousekeepersOnServices` DROP FOREIGN KEY `HousekeepersOnServices_serviceKey_fkey`;

-- DropTable
DROP TABLE `HousekeeperInformations`;

-- DropTable
DROP TABLE `HousekeepersOnServices`;

-- CreateTable
CREATE TABLE `HousekeeperInformation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATE NOT NULL,
    `nationality` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NULL,
    `siretNumber` VARCHAR(191) NULL,
    `hasVehicle` BOOLEAN NULL,
    `hasCleaningEquipment` BOOLEAN NULL,
    `hasInsurance` BOOLEAN NULL,
    `isDeclaredPersonalService` BOOLEAN NULL,
    `businessCustomersAllowed` BOOLEAN NOT NULL DEFAULT false,
    `individualCustomersAllowed` BOOLEAN NOT NULL DEFAULT false,
    `minimumServiceDuration` DOUBLE NULL,
    `weekdayRate` DOUBLE NULL,
    `sundayHolidayRate` DOUBLE NULL,
    `nightRate` DOUBLE NULL,
    `cleaningEquipmentExtraRate` DOUBLE NULL,
    `vatRate` DOUBLE NULL,
    `submissionStep` INTEGER NULL,
    `status` ENUM('IN_PROGRESS', 'PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'IN_PROGRESS',
    `companyAddressId` VARCHAR(191) NULL,
    `ownerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `HousekeeperInformation_companyAddressId_key`(`companyAddressId`),
    UNIQUE INDEX `HousekeeperInformation_ownerId_key`(`ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HousekeeperInformationToHousekeeperService` (
    `informationsId` INTEGER NOT NULL,
    `serviceKey` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`serviceKey`, `informationsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HousekeeperInformation` ADD CONSTRAINT `HousekeeperInformation_companyAddressId_fkey` FOREIGN KEY (`companyAddressId`) REFERENCES `HousekeeperAddress`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperInformation` ADD CONSTRAINT `HousekeeperInformation_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Housekeeper`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperInsurance` ADD CONSTRAINT `HousekeeperInsurance_informationsId_fkey` FOREIGN KEY (`informationsId`) REFERENCES `HousekeeperInformation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperPersonalService` ADD CONSTRAINT `HousekeeperPersonalService_informationsId_fkey` FOREIGN KEY (`informationsId`) REFERENCES `HousekeeperInformation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperInformationToHousekeeperService` ADD CONSTRAINT `HousekeeperInformationToHousekeeperService_informationsId_fkey` FOREIGN KEY (`informationsId`) REFERENCES `HousekeeperInformation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperInformationToHousekeeperService` ADD CONSTRAINT `HousekeeperInformationToHousekeeperService_serviceKey_fkey` FOREIGN KEY (`serviceKey`) REFERENCES `HousekeeperService`(`key`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperGeographicalArea` ADD CONSTRAINT `HousekeeperGeographicalArea_informationsId_fkey` FOREIGN KEY (`informationsId`) REFERENCES `HousekeeperInformation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperAvatar` ADD CONSTRAINT `HousekeeperAvatar_informationsId_fkey` FOREIGN KEY (`informationsId`) REFERENCES `HousekeeperInformation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperDocument` ADD CONSTRAINT `HousekeeperDocument_informationsId_fkey` FOREIGN KEY (`informationsId`) REFERENCES `HousekeeperInformation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
