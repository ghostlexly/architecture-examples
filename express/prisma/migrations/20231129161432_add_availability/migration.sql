-- CreateTable
CREATE TABLE `HousekeeperAvailability` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HousekeeperAvailabilityInterval` (
    `id` VARCHAR(191) NOT NULL,
    `startTime` TIME NOT NULL,
    `endTime` TIME NOT NULL,
    `availabilityId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HousekeeperAvailability` ADD CONSTRAINT `HousekeeperAvailability_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Housekeeper`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperAvailabilityInterval` ADD CONSTRAINT `HousekeeperAvailabilityInterval_availabilityId_fkey` FOREIGN KEY (`availabilityId`) REFERENCES `HousekeeperAvailability`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
