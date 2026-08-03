-- Migration: create SoDauBai table
-- Manual execution only

CREATE TABLE IF NOT EXISTS SoDauBai (
  record_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  week_id VARCHAR(4) NOT NULL,
  class_id VARCHAR(8) NOT NULL,
  periods_data JSON NOT NULL,
  quantity INT NOT NULL,
  create_by VARCHAR(15) NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_by VARCHAR(15) NULL,
  UNIQUE KEY uq_week_class (week_id, class_id),
  CONSTRAINT fk_sodaubai_week FOREIGN KEY (week_id) REFERENCES Week(week_id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_sodaubai_class FOREIGN KEY (class_id) REFERENCES Class(class_id) ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
