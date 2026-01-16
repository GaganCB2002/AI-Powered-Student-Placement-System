-- Create Database
CREATE DATABASE IF NOT EXISTS aipsms_db;
USE aipsms_db;

-- Users Table (Students, Placement Officers, Company HR, Principals)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'PLACEMENT_OFFICER', 'COMPANY_HR', 'PRINCIPAL') NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students Profile
CREATE TABLE IF NOT EXISTS student_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    resume_url VARCHAR(500),
    skills TEXT, -- JSON or comma-separated
    cgpa DECIMAL(3, 2),
    department VARCHAR(100),
    graduation_year INT,
    placement_status ENUM('NOT_PLACED', 'PLACED') DEFAULT 'NOT_PLACED',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Jobs
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    description TEXT,
    required_skills TEXT,
    salary_range VARCHAR(100),
    location VARCHAR(100),
    posted_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id)
);

-- Applications
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    status ENUM('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED') DEFAULT 'APPLIED',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (student_id) REFERENCES users(id) -- Linking to User ID directly or Student Profile ID
);
