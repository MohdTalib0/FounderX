-- Paddle subscription metadata + end beta period (free / starter / pro only)

-- Former beta users → free (paid plans go through Paddle checkout after deploy)
update public.profiles set plan = 'free' where plan = 'beta';

alter table public.profiles alter column plan set default 'free';

comment on column public.profiles.plan is 'free | starter | pro — set by Paddle webhooks for paid tiers';

alter table public.profiles
  add column if not exists paddle_customer_id text,
  add column if not exists paddle_subscription_id text,
  add column if not exists subscription_status text;

comment on column public.profiles.paddle_customer_id is 'Paddle customer id (ctm_*)';
comment on column public.profiles.paddle_subscription_id is 'Paddle subscription id (sub_*)';
comment on column public.profiles.subscription_status is 'Paddle status: active, canceled, past_due, paused, trialing, etc.';

create index if not exists idx_profiles_paddle_subscription
  on public.profiles(paddle_subscription_id)
  where paddle_subscription_id is not null;
