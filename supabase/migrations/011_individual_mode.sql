-- Add is_individual flag to companies table
-- Distinguishes personal brand accounts (individual mode) from company/startup accounts
alter table companies
  add column if not exists is_individual boolean not null default false;

comment on column companies.is_individual is
  'True when the user chose "Myself" at onboarding (personal brand). False for company/startup brands.';
