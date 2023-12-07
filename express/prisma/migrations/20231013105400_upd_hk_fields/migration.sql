/*
  Warnings:

  - You are about to drop the column `saturdayRate` on the `HousekeeperInformations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `HousekeeperInformations` DROP COLUMN `saturdayRate`,
    ADD COLUMN `cleaningEquipmentExtraRate` DOUBLE NULL,
    ADD COLUMN `vatRate` DOUBLE NULL;
