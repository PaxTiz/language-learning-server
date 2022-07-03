/*
  Warnings:

  - Added the required column `flag` to the `languages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `languages` ADD COLUMN `flag` VARCHAR(255) NOT NULL;
