-- CreateTable
CREATE TABLE `HousekeeperDocuments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('IDENTITY_CARD_FRONT', 'IDENTITY_CARD_BACK', 'KBIS') NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `mediaId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `HousekeeperDocuments_mediaId_key`(`mediaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HousekeeperDocuments` ADD CONSTRAINT `HousekeeperDocuments_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
