-- Migration: add grade to Class and grade_scope to Users

ALTER TABLE Class
  ADD COLUMN grade INT NOT NULL DEFAULT 0;

ALTER TABLE Users
  ADD COLUMN grade_scope INT NULL;
