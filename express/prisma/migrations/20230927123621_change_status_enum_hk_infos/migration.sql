/*
  Warnings:

  - You are about to drop the column `isApproved` on the `HousekeeperInformations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `HousekeeperInformations` DROP COLUMN `isApproved`,
    ADD COLUMN `status` ENUM('IN_PROGRESS', 'PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'IN_PROGRESS';
