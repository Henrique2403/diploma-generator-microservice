CREATE DATABASE IF NOT EXISTS degrees_system;
USE degrees_system;

CREATE TABLE degrees (
    `id`              INT AUTO_INCREMENT PRIMARY KEY,
    `guid`            VARCHAR(36) NOT NULL,
    `name`            VARCHAR(50) NOT NULL,
    `nacionality`     VARCHAR(20) NOT NULL,
    `state`           VARCHAR(20) NOT NULL,
    `birthday`        VARCHAR(10) NOT NULL,
    `document`        VARCHAR(12) NOT NULL,
    `conclusion_date` VARCHAR(10) NOT NULL,
    `course`          VARCHAR(50) NOT NULL,
    `workload`        VARCHAR(10) NOT NULL,
    `emission_date`   DATE NOT NULL,
    `signature`       VARCHAR(50) NOT NULL,
    `job_position`    VARCHAR(50) NOT NULL
);

CREATE TABLE signatures (
    `id`              INT AUTO_INCREMENT PRIMARY KEY,
    `degree_id`       INT,
    `name`            VARCHAR(50) NOT NULL,
    `job_position`    VARCHAR(50) NOT NULL,
    FOREIGN KEY (degree_id) REFERENCES degrees(id)
);