CREATE DATABASE IF NOT EXISTS degrees_system;
USE degrees_system;

CREATE TABLE degrees (
    `id`               INT AUTO_INCREMENT PRIMARY KEY,
    `guid`             VARCHAR(36),
    `student_name`             VARCHAR(50),
    `nacionality`      VARCHAR(20),
    `state`            VARCHAR(20),
    `birthday`         VARCHAR(10),
    `document`         VARCHAR(12),
    `conclusion_date`  VARCHAR(10),
    `course`           VARCHAR(50),
    `workload`         VARCHAR(10),
    `emission_date`    DATE,
    `template_diploma` TEXT
);

CREATE TABLE signatures (
    `id`               INT AUTO_INCREMENT PRIMARY KEY,
    `degree_id`        INT,
    `name`             VARCHAR(50),
    `job_position`     VARCHAR(50),
    FOREIGN KEY (degree_id) REFERENCES degrees(id)
);