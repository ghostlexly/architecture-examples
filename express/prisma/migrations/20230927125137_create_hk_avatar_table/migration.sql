-- CreateTable
CREATE TABLE `HousekeeperAvatar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mediaId` VARCHAR(191) NOT NULL,
    `housekeeperInformationsId` INTEGER NOT NULL,

    UNIQUE INDEX `HousekeeperAvatar_mediaId_key`(`mediaId`),
    UNIQUE INDEX `HousekeeperAvatar_housekeeperInformationsId_key`(`housekeeperInformationsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HousekeeperAvatar` ADD CONSTRAINT `HousekeeperAvatar_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperAvatar` ADD CONSTRAINT `HousekeeperAvatar_housekeeperInformationsId_fkey` FOREIGN KEY (`housekeeperInformationsId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
