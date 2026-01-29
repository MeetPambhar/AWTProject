-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    `department` VARCHAR(100) NULL,
    `phone` VARCHAR(20) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_role_idx`(`role`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buildings` (
    `building_id` INTEGER NOT NULL AUTO_INCREMENT,
    `building_name` VARCHAR(100) NOT NULL,
    `location` VARCHAR(255) NULL,
    `floors` INTEGER NULL DEFAULT 1,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`building_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resource_types` (
    `type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `resource_types_type_name_key`(`type_name`),
    PRIMARY KEY (`type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resources` (
    `resource_id` INTEGER NOT NULL AUTO_INCREMENT,
    `resource_name` VARCHAR(100) NOT NULL,
    `type_id` INTEGER NOT NULL,
    `building_id` INTEGER NOT NULL,
    `floor_number` INTEGER NULL,
    `capacity` INTEGER NULL,
    `status` ENUM('available', 'occupied', 'maintenance', 'unavailable') NOT NULL DEFAULT 'available',
    `description` TEXT NULL,
    `amenities` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `resources_status_idx`(`status`),
    PRIMARY KEY (`resource_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facilities` (
    `facility_id` INTEGER NOT NULL AUTO_INCREMENT,
    `resource_id` INTEGER NOT NULL,
    `facility_name` VARCHAR(100) NOT NULL,
    `quantity` INTEGER NULL DEFAULT 1,
    `condition_status` ENUM('good', 'fair', 'poor', 'needs_repair') NOT NULL DEFAULT 'good',
    `last_checked` DATE NULL,
    `notes` TEXT NULL,

    PRIMARY KEY (`facility_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `booking_id` INTEGER NOT NULL AUTO_INCREMENT,
    `resource_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `booking_date` DATE NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `purpose` VARCHAR(255) NULL,
    `status` ENUM('pending', 'approved', 'rejected', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
    `approver_id` INTEGER NULL,
    `approved_at` DATETIME(3) NULL,
    `rejection_reason` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `bookings_booking_date_idx`(`booking_date`),
    INDEX `bookings_status_idx`(`status`),
    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenance` (
    `maintenance_id` INTEGER NOT NULL AUTO_INCREMENT,
    `resource_id` INTEGER NOT NULL,
    `reported_by` INTEGER NOT NULL,
    `issue_title` VARCHAR(200) NOT NULL,
    `issue_description` TEXT NULL,
    `priority` ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    `status` ENUM('reported', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'reported',
    `assigned_to` VARCHAR(100) NULL,
    `resolution_notes` TEXT NULL,
    `reported_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `resolved_at` DATETIME(3) NULL,

    INDEX `maintenance_status_idx`(`status`),
    PRIMARY KEY (`maintenance_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cupboards` (
    `cupboard_id` INTEGER NOT NULL AUTO_INCREMENT,
    `resource_id` INTEGER NOT NULL,
    `cupboard_name` VARCHAR(100) NOT NULL,
    `location_in_room` VARCHAR(100) NULL,
    `total_shelves` INTEGER NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`cupboard_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shelves` (
    `shelf_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cupboard_id` INTEGER NOT NULL,
    `shelf_number` INTEGER NOT NULL,
    `capacity` VARCHAR(50) NULL,
    `current_items` TEXT NULL,
    `is_available` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`shelf_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `resources` ADD CONSTRAINT `resources_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `resource_types`(`type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resources` ADD CONSTRAINT `resources_building_id_fkey` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`building_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facilities` ADD CONSTRAINT `facilities_resource_id_fkey` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`resource_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_resource_id_fkey` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`resource_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_approver_id_fkey` FOREIGN KEY (`approver_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance` ADD CONSTRAINT `maintenance_resource_id_fkey` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`resource_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance` ADD CONSTRAINT `maintenance_reported_by_fkey` FOREIGN KEY (`reported_by`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cupboards` ADD CONSTRAINT `cupboards_resource_id_fkey` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`resource_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shelves` ADD CONSTRAINT `shelves_cupboard_id_fkey` FOREIGN KEY (`cupboard_id`) REFERENCES `cupboards`(`cupboard_id`) ON DELETE CASCADE ON UPDATE CASCADE;
