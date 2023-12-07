/*
  Warnings:

  - You are about to drop the column `housekeeperId` on the `HousekeeperInsurance` table. All the data in the column will be lost.
  - You are about to drop the column `housekeeperId` on the `HousekeeperPersonalService` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[housekeeperInformationsId]` on the table `HousekeeperInsurance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[housekeeperInformationsId]` on the table `HousekeeperPersonalService` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `housekeeperInformationsId` to the `HousekeeperInsurance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `housekeeperInformationsId` to the `HousekeeperPersonalService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `HousekeeperInsurance` DROP FOREIGN KEY `HousekeeperInsurance_housekeeperId_fkey`;

-- DropForeignKey
ALTER TABLE `HousekeeperPersonalService` DROP FOREIGN KEY `HousekeeperPersonalService_housekeeperId_fkey`;

-- AlterTable
ALTER TABLE `HousekeeperInsurance` DROP COLUMN `housekeeperId`,
    ADD COLUMN `housekeeperInformationsId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `HousekeeperPersonalService` DROP COLUMN `housekeeperId`,
    ADD COLUMN `housekeeperInformationsId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `HousekeeperInsurance_housekeeperInformationsId_key` ON `HousekeeperInsurance`(`housekeeperInformationsId`);

-- CreateIndex
CREATE UNIQUE INDEX `HousekeeperPersonalService_housekeeperInformationsId_key` ON `HousekeeperPersonalService`(`housekeeperInformationsId`);

-- AddForeignKey
ALTER TABLE `HousekeeperInsurance` ADD CONSTRAINT `HousekeeperInsurance_housekeeperInformationsId_fkey` FOREIGN KEY (`housekeeperInformationsId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HousekeeperPersonalService` ADD CONSTRAINT `HousekeeperPersonalService_housekeeperInformationsId_fkey` FOREIGN KEY (`housekeeperInformationsId`) REFERENCES `HousekeeperInformations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
