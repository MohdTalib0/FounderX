-- Client-side checkout event log — tracks opens, closes, failures, completions.
-- Answers: "what's our checkout conversion rate?", "how many users abandon?"

create table if not exists public.checkout_events (
  id          bigint generated always as identity primary key,
  user_id     uuid references public.profiles(id) on delete set null,
  event       text not null,         -- checkout.loaded, checkout.closed, checkout.completed, checkout.error
  price_id    text,                  -- which plan they were looking at
  metadata    jsonb,                 -- error details, payment method, etc.
  created_at  timestamptz not null default now()
);

create index idx_checkout_events_user   on public.checkout_events(user_id, created_at desc);
create index idx_checkout_events_recent on public.checkout_events(created_at desc);

alter table public.checkout_events enable row level security;

-- Authenticated users can insert their own events and read their own
create policy "Users can insert own checkout events"
  on public.checkout_events for insert
  with check (auth.uid() = user_id);

create policy "Users can read own checkout events"
  on public.checkout_events for select
  using (auth.uid() = user_id);

grant select, insert on table public.checkout_events to authenticated;
