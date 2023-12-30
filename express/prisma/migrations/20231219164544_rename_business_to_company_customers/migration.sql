/*
  Warnings:

  - You are about to drop the column `businessCustomersAllowed` on the `HousekeeperInformation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `HousekeeperInformation` DROP COLUMN `businessCustomersAllowed`,
    ADD COLUMN `companyCustomersAllowed` BOOLEAN NOT NULL DEFAULT false;
