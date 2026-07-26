ALTER TABLE submissions ADD COLUMN reward_points REAL NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS submission_likes (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES submissions(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  UNIQUE(submission_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_submission_likes_submission ON submission_likes(submission_id);

CREATE TABLE IF NOT EXISTS submission_comments (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES submissions(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'visible',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_submission_comments_submission ON submission_comments(submission_id, created_at);
