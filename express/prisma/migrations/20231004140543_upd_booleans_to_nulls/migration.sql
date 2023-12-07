/*
  Warnings:

  - You are about to drop the column `insuranceCompanyName` on the `HousekeeperInsurance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `HousekeeperInformations` MODIFY `hasInsurance` BOOLEAN NULL,
    MODIFY `isDeclaredPersonalService` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `HousekeeperInsurance` DROP COLUMN `insuranceCompanyName`,
    ADD COLUMN `companyName` VARCHAR(191) NULL;
