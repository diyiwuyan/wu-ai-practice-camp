CREATE TABLE IF NOT EXISTS user_points (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  balance REAL NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS point_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  amount REAL NOT NULL,
  type TEXT NOT NULL,
  reference_id TEXT,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON point_transactions(user_id, created_at);

CREATE TABLE IF NOT EXISTS redemption_codes (
  id TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL UNIQUE,
  points REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'unused',
  redeemed_by TEXT,
  redeemed_at TEXT,
  created_at TEXT NOT NULL,
  created_by TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_redemption_codes_status ON redemption_codes(status, created_at);

CREATE TABLE IF NOT EXISTS course_prices (
  course_id TEXT PRIMARY KEY,
  points REAL NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO course_prices (course_id, points, updated_at) VALUES
  ('codex', 49.9, CURRENT_TIMESTAMP),
  ('image', 49.9, CURRENT_TIMESTAMP),
  ('career', 49.9, CURRENT_TIMESTAMP);
