-- AlterTable
ALTER TABLE `HousekeeperInformations` ADD COLUMN `bankBIC` VARCHAR(191) NULL,
    ADD COLUMN `bankIBAN` VARCHAR(191) NULL,
    ADD COLUMN `businessCustomersAllowed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `individualCustomersAllowed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `maximumServiceDuration` DOUBLE NULL,
    ADD COLUMN `minimumServiceDuration` DOUBLE NULL,
    ADD COLUMN `nightRate` DOUBLE NULL,
    ADD COLUMN `personalVehicleType` ENUM('CAR', 'MOTORBIKE') NULL,
    ADD COLUMN `saturdayRate` DOUBLE NULL,
    ADD COLUMN `sundayHolidayRate` DOUBLE NULL,
    ADD COLUMN `weekdayRate` DOUBLE NULL;

-- CreateTable
CREATE TABLE `HousekeeperGeographicalArea` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postalCode` VARCHAR(191) NOT NULL,
    `housekeeperInformationsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HousekeeperGeographicalArea` ADD CONSTRAINT `HousekeeperGeographicalArea_housekeeperInformationsId_fkey` FOREIGN KEY (`housekeeperInformationsId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
