-- Grant table-level access to the authenticated role.
-- RLS policies control which rows; these grants enable access to the tables at all.

grant usage on schema public to anon, authenticated;

grant select, insert, update           on table public.profiles          to authenticated;  -- no delete: use account deletion flow via auth.users cascade
grant select, insert, update, delete on table public.companies         to authenticated;
grant select, insert, update, delete on table public.generated_posts   to authenticated;
grant select, insert, update, delete on table public.comment_suggestions to authenticated;
grant select, insert, update, delete on table public.draft_rewrites    to authenticated;

-- anon only needs to call the auth trigger (handle_new_user runs as security definer)
-- no direct table access needed for anon
