INSERT OR IGNORE INTO course_prices (course_id, points, updated_at) VALUES
  ('codex-entry', 49.9, CURRENT_TIMESTAMP),
  ('codex-advanced', 79.9, CURRENT_TIMESTAMP),
  ('codex-orange-book', 9.9, CURRENT_TIMESTAMP);

UPDATE course_prices SET points = 9.9, updated_at = CURRENT_TIMESTAMP WHERE course_id = 'codex-orange-book';
