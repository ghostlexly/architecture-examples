/*
  Warnings:

  - The values [KBIS] on the enum `HousekeeperDocument_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `HousekeeperDocument` MODIFY `type` ENUM('IDENTITY_CARD_FRONT', 'IDENTITY_CARD_BACK', 'INPI') NOT NULL;
