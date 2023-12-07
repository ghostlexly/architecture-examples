/*
  Warnings:

  - You are about to drop the column `maximumServiceDuration` on the `HousekeeperInformations` table. All the data in the column will be lost.
  - You are about to drop the column `personalVehicleType` on the `HousekeeperInformations` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `HousekeeperInformations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `HousekeeperInformations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `HousekeeperInformations` DROP COLUMN `maximumServiceDuration`,
    DROP COLUMN `personalVehicleType`,
    ADD COLUMN `dateOfBirth` DATE NOT NULL,
    ADD COLUMN `hasCleaningEquipment` BOOLEAN NULL,
    ADD COLUMN `hasVehicle` BOOLEAN NULL,
    ADD COLUMN `nationality` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Country` (
    `id` VARCHAR(191) NOT NULL,
    `continent` VARCHAR(191) NOT NULL,
    `capital` VARCHAR(191) NOT NULL,
    `languages` VARCHAR(191) NOT NULL,
    `isoAlpha3` VARCHAR(191) NOT NULL,
    `fipsCode` VARCHAR(191) NOT NULL,
    `population` INTEGER NOT NULL,
    `isoNumeric` INTEGER NOT NULL,
    `countryCode` VARCHAR(191) NOT NULL,
    `countryName` VARCHAR(191) NOT NULL,
    `postalCodeFormat` VARCHAR(191) NOT NULL,
    `continentName` VARCHAR(191) NOT NULL,
    `currencyCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
