-- Remix a Post ("Steal this structure")
-- User pastes a viral post → AI breaks down the structure → adapts it in the founder's voice

create table if not exists remixed_posts (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  company_id          uuid not null references companies(id) on delete cascade,
  source_post         text not null,
  structure           text not null,   -- e.g. "Problem → Stakes → Twist → Lesson"
  hook_type           text not null,   -- e.g. "Counterintuitive claim"
  tone                text not null,   -- e.g. "Vulnerable + authoritative"
  why_it_works        text not null,   -- 1-sentence explanation
  adapted_version     text not null,   -- full post in founder's voice
  is_saved            boolean not null default false,
  created_at          timestamptz not null default now()
);

alter table remixed_posts enable row level security;

create policy "Users own their remixes" on remixed_posts
  for all using (auth.uid() = user_id);
