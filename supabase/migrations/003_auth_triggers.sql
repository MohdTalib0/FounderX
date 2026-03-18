-- ─── updated_at triggers ─────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create or replace trigger companies_updated_at
  before update on companies
  for each row execute function set_updated_at();

-- ─── Sync email from auth.users → profiles on email change ───────────────────

create or replace function sync_user_email()
returns trigger as $$
begin
  if new.email <> old.email then
    update public.profiles
    set email = new.email
    where id = new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_email_updated
  after update on auth.users
  for each row execute function sync_user_email();
