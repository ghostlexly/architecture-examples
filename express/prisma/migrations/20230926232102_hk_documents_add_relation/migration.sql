/*
  Warnings:

  - Added the required column `housekeeperInformationsId` to the `HousekeeperDocuments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `HousekeeperDocuments` ADD COLUMN `housekeeperInformationsId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `HousekeeperDocuments` ADD CONSTRAINT `HousekeeperDocuments_housekeeperInformationsId_fkey` FOREIGN KEY (`housekeeperInformationsId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
