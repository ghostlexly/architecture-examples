/*
  Warnings:

  - You are about to drop the column `street` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `bankBIC` on the `HousekeeperInformations` table. All the data in the column will be lost.
  - You are about to drop the column `bankIBAN` on the `HousekeeperInformations` table. All the data in the column will be lost.
  - Added the required column `address` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Address`
    CHANGE `street` `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `addressDetails` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `HousekeeperInformations` DROP COLUMN `bankBIC`,
    DROP COLUMN `bankIBAN`;

-- CreateTable
CREATE TABLE `BankAccount` (
    `id` VARCHAR(191) NOT NULL,
    `accountOwnerName` VARCHAR(191) NOT NULL,
    `IBAN` VARCHAR(191) NOT NULL,
    `BIC` VARCHAR(191) NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `addressId` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BankAccount` ADD CONSTRAINT `BankAccount_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankAccount` ADD CONSTRAINT `BankAccount_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
