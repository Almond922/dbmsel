-- Migration: add fields for auto-assign
ALTER TABLE Users
  ADD COLUMN IF NOT EXISTS max_capacity INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_load INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8) NULL,
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8) NULL,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_users_role_lat_lng ON Users (role_id, latitude, longitude);

-- Mark assignments created by auto-assign (optional)
ALTER TABLE Assignments
  ADD COLUMN IF NOT EXISTS auto_assigned BOOLEAN NOT NULL DEFAULT FALSE;
