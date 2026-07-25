CREATE TABLE IF NOT EXISTS referral_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  code TEXT NOT NULL UNIQUE,
  inviter_id TEXT REFERENCES users(id),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_referral_profiles_inviter ON referral_profiles(inviter_id);
