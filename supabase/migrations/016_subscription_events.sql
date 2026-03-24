-- Subscription event log — immutable audit trail for every Paddle webhook.
-- Answers: "when did this user upgrade?", "how many cancellations this week?",
-- "average time from free → paid", etc.

create table if not exists public.subscription_events (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  event_type    text not null,                     -- subscription.created, .updated, .canceled, .paused, .resumed, etc.
  plan          text,                              -- resolved plan at time of event: free, starter, pro
  status        text,                              -- Paddle status: active, canceled, past_due, paused, trialing
  paddle_subscription_id text,                     -- sub_*
  paddle_customer_id     text,                     -- ctm_*
  created_at    timestamptz not null default now()
);

comment on table public.subscription_events is 'Immutable log of every Paddle subscription webhook. Never updated or deleted.';

-- Fast lookups: user history + recent events dashboard
create index idx_sub_events_user   on public.subscription_events(user_id, created_at desc);
create index idx_sub_events_recent on public.subscription_events(created_at desc);

-- RLS: only service_role writes (via webhook), users can read their own events
alter table public.subscription_events enable row level security;

create policy "Users can read own subscription events"
  on public.subscription_events for select
  using (auth.uid() = user_id);

-- Service role (used by webhook) bypasses RLS, so no insert policy needed for it.
-- Block authenticated users from inserting/updating/deleting directly.
