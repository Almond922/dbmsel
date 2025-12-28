-- Migration: Add assignment run logs for auto-assign

CREATE TABLE IF NOT EXISTS Assignment_Runs (
  run_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  dry_run BOOLEAN NOT NULL DEFAULT FALSE,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  finished_at DATETIME NULL,
  total_candidates INT DEFAULT 0,
  total_assigned INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Assignment_Run_Results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  run_id INT NOT NULL,
  request_id INT NOT NULL,
  assigned BOOLEAN NOT NULL DEFAULT FALSE,
  assignment_id INT DEFAULT NULL,
  assigned_to INT DEFAULT NULL,
  reason VARCHAR(255) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (run_id) REFERENCES Assignment_Runs(run_id) ON DELETE CASCADE
);
