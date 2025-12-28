-- Migration: add password_hash to Users
ALTER TABLE Users
  ADD COLUMN password_hash VARCHAR(255) NULL,
  ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Note: existing sample users will not have passwords. Use the register endpoint to create users with passwords.