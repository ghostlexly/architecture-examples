-- CreateTable
CREATE TABLE `Housekeeper` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'CUSTOMER', 'HOUSEKEEPER') NOT NULL,

    UNIQUE INDEX `Housekeeper_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'CUSTOMER', 'HOUSEKEEPER') NOT NULL,

    UNIQUE INDEX `Customer_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Media` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `mimetype` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `path` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Country` (
    `id` VARCHAR(191) NOT NULL,
    `countryName` VARCHAR(191) NOT NULL,
    `countryCode` VARCHAR(191) NOT NULL,
    `isoAlpha3` VARCHAR(191) NOT NULL,
    `isoNumeric` INTEGER NOT NULL,
    `fipsCode` VARCHAR(191) NULL,
    `continent` VARCHAR(191) NOT NULL,
    `continentName` VARCHAR(191) NOT NULL,
    `currencyCode` VARCHAR(191) NULL,
    `postalCodeFormat` VARCHAR(191) NULL,
    `capital` VARCHAR(191) NULL,
    `languages` VARCHAR(191) NULL,
    `population` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HousekeeperInformations` (
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

    UNIQUE INDEX `HousekeeperInformations_companyAddressId_key`(`companyAddressId`),
    UNIQUE INDEX `HousekeeperInformations_ownerId_key`(`ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HousekeeperInsurance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `societaryNumber` VARCHAR(191) NULL,
    `companyName` VARCHAR(191) NULL,
    `certificateMediaId` VARCHAR(191) NULL,
    `informationsId` INTEGER NOT NULL,

    UNIQUE INDEX `HousekeeperInsurance_certificateMediaId_key`(`certificateMediaId`),
    UNIQUE INDEX `HousekeeperInsurance_informationsId_key`(`informationsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HousekeeperPersonalService` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sapNumber` VARCHAR(191) NULL,
    `startOfActivity` DATE NULL,
    `informationsId` INTEGER NOT NULL,

    UNIQUE INDEX `HousekeeperPersonalService_informationsId_key`(`informationsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HousekeeperService` (
    `key` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `availableForSap` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HousekeepersOnServices` (
    `serviceKey` VARCHAR(191) NOT NULL,
    `informationsId` INTEGER NOT NULL,

    PRIMARY KEY (`serviceKey`, `informationsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HousekeeperGeographicalArea` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postalCode` VARCHAR(191) NOT NULL,
    `informationsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HousekeeperAvatar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mediaId` VARCHAR(191) NOT NULL,
    `informationsId` INTEGER NOT NULL,

    UNIQUE INDEX `HousekeeperAvatar_mediaId_key`(`mediaId`),
    UNIQUE INDEX `HousekeeperAvatar_informationsId_key`(`informationsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HousekeeperDocument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('IDENTITY_CARD_FRONT', 'IDENTITY_CARD_BACK', 'KBIS') NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `mediaId` VARCHAR(191) NOT NULL,
    `informationsId` INTEGER NOT NULL,

    UNIQUE INDEX `HousekeeperDocument_mediaId_key`(`mediaId`),
    UNIQUE INDEX `HousekeeperDocument_informationsId_type_key`(`informationsId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HousekeeperBankAccount` (
    `id` VARCHAR(191) NOT NULL,
    `accountOwnerName` VARCHAR(191) NOT NULL,
    `IBAN` VARCHAR(191) NOT NULL,
    `BIC` VARCHAR(191) NOT NULL,
    `mandateId` VARCHAR(191) NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `ownerAddressId` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HousekeeperAddress` (
    `id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `addressDetails` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HousekeeperInformations` ADD CONSTRAINT `HousekeeperInformations_companyAddressId_fkey` FOREIGN KEY (`companyAddressId`) REFERENCES `HousekeeperAddress`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperInformations` ADD CONSTRAINT `HousekeeperInformations_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Housekeeper`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperInsurance` ADD CONSTRAINT `HousekeeperInsurance_certificateMediaId_fkey` FOREIGN KEY (`certificateMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperInsurance` ADD CONSTRAINT `HousekeeperInsurance_informationsId_fkey` FOREIGN KEY (`informationsId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperPersonalService` ADD CONSTRAINT `HousekeeperPersonalService_informationsId_fkey` FOREIGN KEY (`informationsId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeepersOnServices` ADD CONSTRAINT `HousekeepersOnServices_serviceKey_fkey` FOREIGN KEY (`serviceKey`) REFERENCES `HousekeeperService`(`key`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeepersOnServices` ADD CONSTRAINT `HousekeepersOnServices_informationsId_fkey` FOREIGN KEY (`informationsId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperGeographicalArea` ADD CONSTRAINT `HousekeeperGeographicalArea_informationsId_fkey` FOREIGN KEY (`informationsId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperAvatar` ADD CONSTRAINT `HousekeeperAvatar_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperAvatar` ADD CONSTRAINT `HousekeeperAvatar_informationsId_fkey` FOREIGN KEY (`informationsId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperDocument` ADD CONSTRAINT `HousekeeperDocument_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperDocument` ADD CONSTRAINT `HousekeeperDocument_informationsId_fkey` FOREIGN KEY (`informationsId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperBankAccount` ADD CONSTRAINT `HousekeeperBankAccount_ownerAddressId_fkey` FOREIGN KEY (`ownerAddressId`) REFERENCES `HousekeeperAddress`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperBankAccount` ADD CONSTRAINT `HousekeeperBankAccount_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Housekeeper`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperAddress` ADD CONSTRAINT `HousekeeperAddress_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Housekeeper`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
