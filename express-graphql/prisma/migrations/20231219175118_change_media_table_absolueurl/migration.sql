/*
  Warnings:

  - You are about to drop the column `absolutePath` on the `Media` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Media` DROP COLUMN `absolutePath`,
    ADD COLUMN `absoluteUrl` TEXT NULL;
