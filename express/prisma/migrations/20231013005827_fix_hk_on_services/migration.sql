/*
  Warnings:

  - The primary key for the `HousekeeperService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `housekeeperInformationsId` on the `HousekeeperService` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `HousekeeperService` table. All the data in the column will be lost.
  - Added the required column `key` to the `HousekeeperService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `HousekeeperService` DROP FOREIGN KEY `HousekeeperService_housekeeperInformationsId_fkey`;

-- AlterTable
ALTER TABLE `HousekeeperService` DROP PRIMARY KEY,
    DROP COLUMN `housekeeperInformationsId`,
    DROP COLUMN `id`,
    ADD COLUMN `key` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`key`);

-- CreateTable
CREATE TABLE `HousekeepersOnServices` (
    `housekeeperServiceKey` VARCHAR(191) NOT NULL,
    `housekeeperInformationsId` INTEGER NOT NULL,

    PRIMARY KEY (`housekeeperServiceKey`, `housekeeperInformationsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HousekeepersOnServices` ADD CONSTRAINT `HousekeepersOnServices_housekeeperServiceKey_fkey` FOREIGN KEY (`housekeeperServiceKey`) REFERENCES `HousekeeperService`(`key`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeepersOnServices` ADD CONSTRAINT `HousekeepersOnServices_housekeeperInformationsId_fkey` FOREIGN KEY (`housekeeperInformationsId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
