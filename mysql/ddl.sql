CREATE DATABASE IF NOT EXISTS degrees_system;
USE degrees_system

CREATE TABLE degrees (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    guid            VARCHAR2(36) NOT NULL,
    name            VARCHAR2(50) NOT NULL,
    nacionality     VARCHAR2(20) NOT NULL,
    state           VARCHAR2(20) NOT NULL,
    birthday        VARCHAR2(10) NOT NULL,
    document        VARCHAR2(12) NOT NULL,
    conclusion_date VARCHAR2(10) NOT NULL,
    course          VARCHAR2(50) NOT NULL,
    workload        VARCHAR2(10) NOT NULL,
    emission_date   DATE NOT NULL,
    signature       VARCHAR2(50) NOT NULL,
    job_position    VARCHAR2(50) NOT NULL
);

CREATE TABLE signatures (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    degree_id       INT,
    name            VARCHAR2(50) NOT NULL,
    job_position    VARCHAR2(50) NOT NULL,
    FOREIGN KEY (degree_id) REFERENCES degrees(id)
);