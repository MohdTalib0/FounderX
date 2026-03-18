-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (auto-created on signup via trigger)
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text,
  avatar_url text,
  onboarded  boolean not null default false,
  plan       text not null default 'free',
  posts_this_month     int not null default 0,
  comments_this_month  int not null default 0,
  last_posted_at       timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- COMPANIES (founder's brand context)
create table companies (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  name                text not null,
  description         text not null,
  target_audience     text not null,
  industry            text[] not null,
  stage               text not null,
  founder_goal        text not null,
  tone                text not null default 'casual',
  founder_personality text not null,
  persona_statement   text,
  content_pillars     text[],
  keywords            text[],
  website_url         text,
  linkedin_url        text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- GENERATED_POSTS
create table generated_posts (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null references auth.users(id) on delete cascade,
  company_id              uuid not null references companies(id) on delete cascade,
  topic                   text not null,
  variation_safe          text not null,
  variation_bold          text not null,
  variation_controversial text not null,
  selected_variation      text,
  post_structure          text,
  hook_type               text,
  tone_used               text not null,
  is_saved                boolean not null default false,
  is_published            boolean not null default false,
  published_at            timestamptz,
  linkedin_url            text,
  was_copied              boolean not null default false,
  performance_rating      smallint,
  created_at              timestamptz not null default now()
);

-- COMMENT_SUGGESTIONS
create table comment_suggestions (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  company_id          uuid not null references companies(id) on delete cascade,
  source_post         text not null,
  source_url          text,
  comment_insightful  text not null,
  comment_curious     text not null,
  comment_bold        text not null,
  is_saved            boolean not null default false,
  created_at          timestamptz not null default now()
);

-- DRAFT_REWRITES
create table draft_rewrites (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  company_id     uuid not null references companies(id) on delete cascade,
  original_draft text not null,
  rewritten      text not null,
  hooks          text[],
  selected_hook  text,
  is_saved       boolean not null default false,
  created_at     timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Row Level Security
alter table profiles enable row level security;
alter table companies enable row level security;
alter table generated_posts enable row level security;
alter table comment_suggestions enable row level security;
alter table draft_rewrites enable row level security;

-- Policies: users can only access their own data
create policy "Users own their profile" on profiles
  for all using (auth.uid() = id);

create policy "Users own their companies" on companies
  for all using (auth.uid() = user_id);

create policy "Users own their posts" on generated_posts
  for all using (auth.uid() = user_id);

create policy "Users own their comments" on comment_suggestions
  for all using (auth.uid() = user_id);

create policy "Users own their rewrites" on draft_rewrites
  for all using (auth.uid() = user_id);
