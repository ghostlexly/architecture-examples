/*
  Warnings:

  - You are about to drop the `HousekeeperDocuments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `HousekeeperDocuments` DROP FOREIGN KEY `HousekeeperDocuments_housekeeperInformationsId_fkey`;

-- DropForeignKey
ALTER TABLE `HousekeeperDocuments` DROP FOREIGN KEY `HousekeeperDocuments_mediaId_fkey`;

-- DropTable
DROP TABLE `HousekeeperDocuments`;

-- CreateTable
CREATE TABLE `HousekeeperService` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `housekeeperInformationsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HousekeeperDocument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('IDENTITY_CARD_FRONT', 'IDENTITY_CARD_BACK', 'KBIS') NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `mediaId` VARCHAR(191) NOT NULL,
    `housekeeperInformationsId` INTEGER NOT NULL,

    UNIQUE INDEX `HousekeeperDocument_mediaId_key`(`mediaId`),
    UNIQUE INDEX `HousekeeperDocument_housekeeperInformationsId_type_key`(`housekeeperInformationsId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HousekeeperService` ADD CONSTRAINT `HousekeeperService_housekeeperInformationsId_fkey` FOREIGN KEY (`housekeeperInformationsId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperDocument` ADD CONSTRAINT `HousekeeperDocument_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperDocument` ADD CONSTRAINT `HousekeeperDocument_housekeeperInformationsId_fkey` FOREIGN KEY (`housekeeperInformationsId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
