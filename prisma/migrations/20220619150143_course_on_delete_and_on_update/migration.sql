-- DropForeignKey
ALTER TABLE `courses` DROP FOREIGN KEY `courses_language_id_fkey`;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_language_id_fkey` FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
