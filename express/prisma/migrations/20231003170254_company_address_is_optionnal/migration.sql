-- DropForeignKey
ALTER TABLE `HousekeeperInformations` DROP FOREIGN KEY `HousekeeperInformations_companyAddressId_fkey`;

-- AlterTable
ALTER TABLE `HousekeeperInformations` MODIFY `companyAddressId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `HousekeeperInformations` ADD CONSTRAINT `HousekeeperInformations_companyAddressId_fkey` FOREIGN KEY (`companyAddressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
