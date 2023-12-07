/*
  Warnings:

  - A unique constraint covering the columns `[housekeeperInformationsId,type]` on the table `HousekeeperDocuments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `HousekeeperDocuments_housekeeperInformationsId_type_key` ON `HousekeeperDocuments`(`housekeeperInformationsId`, `type`);
