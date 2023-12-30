-- CreateTable
CREATE TABLE `CustomerInformation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('INDIVIDUAL', 'COMPANY') NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CustomerInformation_ownerId_key`(`ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomerInformation` ADD CONSTRAINT `CustomerInformation_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
