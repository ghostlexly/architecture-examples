/*
  Warnings:

  - Added the required column `absolutePath` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Media` ADD COLUMN `absolutePath` VARCHAR(191) NOT NULL;
