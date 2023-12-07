/*
  Warnings:

  - You are about to drop the column `addressId` on the `BankAccount` table. All the data in the column will be lost.
  - Added the required column `ownerAddressId` to the `BankAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `BankAccount` DROP FOREIGN KEY `BankAccount_addressId_fkey`;

-- AlterTable
ALTER TABLE `BankAccount` DROP COLUMN `addressId`,
    ADD COLUMN `ownerAddressId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `BankAccount` ADD CONSTRAINT `BankAccount_ownerAddressId_fkey` FOREIGN KEY (`ownerAddressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
