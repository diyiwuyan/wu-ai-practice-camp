CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  name VARCHAR(40) NOT NULL DEFAULT '',
  role ENUM('admin','learner') NOT NULL DEFAULT 'learner',
  status ENUM('active','suspended','deleted') NOT NULL DEFAULT 'active',
  password_hash CHAR(128) NOT NULL,
  password_salt CHAR(64) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_users_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(64) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  expires_at BIGINT NOT NULL,
  created_at DATETIME NOT NULL,
  INDEX idx_sessions_user (user_id),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_points (
  user_id CHAR(36) PRIMARY KEY,
  balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL,
  CONSTRAINT fk_points_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS course_entitlements (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  course_id VARCHAR(30) NOT NULL,
  granted_by VARCHAR(60),
  granted_at DATETIME NOT NULL,
  UNIQUE KEY uniq_course_entitlement (user_id, course_id),
  CONSTRAINT fk_entitlements_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS redemption_codes (
  id CHAR(36) PRIMARY KEY,
  code_hash CHAR(64) NOT NULL UNIQUE,
  points DECIMAL(12,2) NOT NULL,
  status ENUM('unused','redeemed') NOT NULL DEFAULT 'unused',
  redeemed_by CHAR(36),
  redeemed_at DATETIME,
  created_at DATETIME NOT NULL,
  created_by CHAR(36) NOT NULL,
  INDEX idx_codes_status (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS point_transactions (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  type VARCHAR(40) NOT NULL,
  reference_id VARCHAR(100),
  note VARCHAR(255) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL,
  INDEX idx_transactions_user (user_id, created_at),
  CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS referral_profiles (
  user_id CHAR(36) PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  inviter_id CHAR(36),
  created_at DATETIME NOT NULL,
  INDEX idx_referral_inviter (inviter_id),
  CONSTRAINT fk_referral_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS submissions (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  title VARCHAR(100) NOT NULL,
  category VARCHAR(30) NOT NULL,
  description TEXT NOT NULL,
  prompt MEDIUMTEXT NOT NULL,
  asset_url VARCHAR(500) NOT NULL DEFAULT '',
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  reviewer_note TEXT NOT NULL,
  reward_points DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  reviewed_at DATETIME,
  INDEX idx_submissions_status (status, created_at),
  CONSTRAINT fk_submissions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS submission_likes (
  id CHAR(36) PRIMARY KEY,
  submission_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY uniq_like (submission_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS submission_comments (
  id CHAR(36) PRIMARY KEY,
  submission_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  text VARCHAR(500) NOT NULL,
  status ENUM('visible','hidden') NOT NULL DEFAULT 'visible',
  created_at DATETIME NOT NULL,
  INDEX idx_comments_submission (submission_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
