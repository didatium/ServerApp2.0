-- Migration: add Student table and add student_id to Vipham
-- This file is for manual execution only.

CREATE TABLE IF NOT EXISTS Student (
  student_id VARCHAR(36) NOT NULL PRIMARY KEY,
  student_name VARCHAR(100) NOT NULL,
  class_id VARCHAR(8) NOT NULL COLLATE utf8mb4_unicode_ci,
  CONSTRAINT fk_student_class FOREIGN KEY (class_id) REFERENCES Class(class_id) ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE Vipham
  ADD COLUMN student_id VARCHAR(36) NULL AFTER name_student,
  ADD CONSTRAINT fk_vipham_student FOREIGN KEY (student_id) REFERENCES Student(student_id) ON UPDATE RESTRICT ON DELETE SET NULL;
