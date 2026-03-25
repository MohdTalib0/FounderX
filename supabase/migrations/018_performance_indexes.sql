-- Performance indexes — covers all hot query paths (March 2026)
-- All use IF NOT EXISTS so this is safe to re-run.

-- ── generated_posts (History page, post generation w/ recent posts lookup) ────
create index if not exists idx_generated_posts_user_created
  on generated_posts(user_id, created_at desc);

-- ── remixed_posts (History page) ─────────────────────────────────────────────
create index if not exists idx_remixed_posts_user_created
  on remixed_posts(user_id, created_at desc);

-- ── comment_suggestions (History page, engage flow) ──────────────────────────
create index if not exists idx_comment_suggestions_user_created
  on comment_suggestions(user_id, created_at desc);

-- ── draft_rewrites (History page, rewrite flow) ──────────────────────────────
create index if not exists idx_draft_rewrites_user_created
  on draft_rewrites(user_id, created_at desc);

-- ── companies (fetched on every dashboard load via user_id) ──────────────────
create index if not exists idx_companies_user_id
  on companies(user_id);

-- ── profiles: paddle_customer_id (webhook resolution) ────────────────────────
create index if not exists idx_profiles_paddle_customer_id
  on profiles(paddle_customer_id)
  where paddle_customer_id is not null;
