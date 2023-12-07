-- DropForeignKey
ALTER TABLE `HousekeeperInformations` DROP FOREIGN KEY `HousekeeperInformations_companyAddressId_fkey`;

-- AddForeignKey
ALTER TABLE `HousekeeperInformations` ADD CONSTRAINT `HousekeeperInformations_companyAddressId_fkey` FOREIGN KEY (`companyAddressId`) REFERENCES `Address`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
