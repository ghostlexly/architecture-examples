-- DropForeignKey
ALTER TABLE `HousekeeperAvailabilityInterval` DROP FOREIGN KEY `HousekeeperAvailabilityInterval_availabilityId_fkey`;

-- AddForeignKey
ALTER TABLE `HousekeeperAvailabilityInterval` ADD CONSTRAINT `HousekeeperAvailabilityInterval_availabilityId_fkey` FOREIGN KEY (`availabilityId`) REFERENCES `HousekeeperAvailability`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
