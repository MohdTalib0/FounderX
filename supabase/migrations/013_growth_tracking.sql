-- ─── Migration 013: Growth & funnel tracking ──────────────────────────────────
--
-- Adds three things the product plan requires but the schema was missing:
--   1. tool_uses       — anonymous + authenticated free tool usage (top-of-funnel)
--   2. waitlist        — email capture from tool pages (pre-signup)
--   3. referrals       — referral loop (Growth Loop 2 from product plan)
--
-- Plus two columns on profiles:
--   - acquisition_source  — how the user first found Wrively
--   - streak_days         — weekly posting streak (persisted, not computed on read)


-- ─── 1. Free tool usage tracking ──────────────────────────────────────────────
-- Captures every tool analysis, anonymous or authenticated.
-- session_id is a client-generated UUID stored in localStorage — lets us
-- stitch anonymous sessions to a user_id after they sign up.
-- No PII is stored here (no IP, no fingerprint — just a random session UUID).

create table if not exists tool_uses (
  id           uuid primary key default uuid_generate_v4(),
  tool         text        not null,  -- 'headline-analyzer' | 'post-checker' | 'voice-analyzer'
  user_id      uuid        references auth.users(id) on delete set null,  -- null = anonymous
  session_id   text,                  -- localStorage UUID, used for post-signup attribution
  score        smallint,              -- 0–100 result score (null if analysis failed)
  used_example boolean     not null default false,  -- clicked example vs pasted own content
  referrer     text,                  -- document.referrer at time of use (trimmed, no query params)
  utm_source   text,                  -- ?utm_source=
  utm_medium   text,                  -- ?utm_medium=
  utm_campaign text,                  -- ?utm_campaign=
  created_at   timestamptz not null default now()
);

-- Index for funnel queries: "which tool sends the most signups?"
create index idx_tool_uses_session    on tool_uses(session_id) where session_id is not null;
create index idx_tool_uses_user       on tool_uses(user_id)    where user_id    is not null;
create index idx_tool_uses_tool_date  on tool_uses(tool, created_at desc);

-- Anonymous writes allowed (no auth) — service role reads for analytics.
-- Authenticated users can also write (links their user_id).
alter table tool_uses enable row level security;

create policy "Anyone can log a tool use" on tool_uses
  for insert with check (true);

-- Users can read their own attributed tool uses; no one can read anonymous rows
create policy "Users read their own tool uses" on tool_uses
  for select using (auth.uid() = user_id);


-- ─── 2. Waitlist ──────────────────────────────────────────────────────────────
-- Email capture for visitors who use a free tool but aren't ready to sign up.
-- Source tells us which tool or page the email came from.

create table if not exists waitlist (
  id         uuid primary key default uuid_generate_v4(),
  email      text        not null,
  source     text,                    -- 'headline-analyzer' | 'post-checker' | 'voice-analyzer' | 'homepage'
  created_at timestamptz not null default now(),
  constraint waitlist_email_unique unique (email)
);

alter table waitlist enable row level security;

-- Anyone can join the waitlist; no one can read it via the anon key (service role only)
create policy "Anyone can join waitlist" on waitlist
  for insert with check (true);


-- ─── 3. Referrals ─────────────────────────────────────────────────────────────
-- Growth Loop 2 from the product plan. Triggered at peak dopamine moments
-- (post rated 🔥, or 5th consecutive generation).

create table if not exists referrals (
  id             uuid primary key default uuid_generate_v4(),
  referrer_id    uuid        not null references auth.users(id) on delete cascade,
  referred_email text,                -- set when the referrer shares to a specific person
  referred_id    uuid        references auth.users(id) on delete set null,  -- set on signup
  status         text        not null default 'pending',  -- 'pending' | 'signed_up' | 'rewarded'
  created_at     timestamptz not null default now()
);

create index idx_referrals_referrer on referrals(referrer_id);
create index idx_referrals_referred on referrals(referred_id) where referred_id is not null;

alter table referrals enable row level security;

create policy "Users own their referrals" on referrals
  for all using (auth.uid() = referrer_id);


-- ─── 4. Profiles additions ────────────────────────────────────────────────────

-- Where did this user first come from?
-- Set once at signup, never changed. Format examples:
--   'tool:headline-analyzer'  — signed up after using a free tool
--   'referral'                — arrived via a referral link
--   'organic'                 — direct / unknown
--   'product-hunt'            — Product Hunt launch
alter table profiles
  add column if not exists acquisition_source text;

-- Weekly posting streak — persisted so the dashboard doesn't recompute it
-- on every load from generated_posts. Updated by the on_post_generated trigger.
alter table profiles
  add column if not exists streak_days int not null default 0;

comment on column profiles.acquisition_source is
  'Top-of-funnel source at signup. Format: "tool:<tool-name>" | "referral" | "organic" | "product-hunt". Set once, never updated.';

comment on column profiles.streak_days is
  'Current weekly posting streak. Incremented by on_post_generated trigger, reset if a week passes without a post.';
