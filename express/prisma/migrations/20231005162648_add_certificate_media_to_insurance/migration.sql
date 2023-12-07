/*
  Warnings:

  - A unique constraint covering the columns `[certificateMediaId]` on the table `HousekeeperInsurance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `HousekeeperInsurance` ADD COLUMN `certificateMediaId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `HousekeeperInsurance_certificateMediaId_key` ON `HousekeeperInsurance`(`certificateMediaId`);

-- AddForeignKey
ALTER TABLE `HousekeeperInsurance` ADD CONSTRAINT `HousekeeperInsurance_certificateMediaId_fkey` FOREIGN KEY (`certificateMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
