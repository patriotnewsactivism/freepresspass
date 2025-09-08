-- Supabase SQL schema for the FreePressPass project
--
-- This migration defines the table used to persist each press pass.
-- It uses a bigint primary key with an identity column to ensure that
-- each pass is assigned a unique numeric identifier.  Additional columns
-- capture the applicant’s name, email, a random pass identifier and the
-- time of creation.  Adjust or extend this schema to suit your needs.

-- Create the table if it does not already exist.  The id column is
-- generated automatically by PostgreSQL’s identity feature, and the
-- created_at column defaults to the current timestamp using now().
-- See Supabase’s migration guide for a similar example where an
-- employees table with a created_at column uses `default now()`【551237751746715†L140-L144】.
create table if not exists public.press_passes (
  id             bigint primary key generated always as identity,
  pass_number    uuid not null default gen_random_uuid(),
  full_name      text not null,
  email          text not null,
  issued_at      timestamptz not null default now(),
  -- Additional fields for auditability and revocation
  revoked        boolean not null default false,
  revoked_at     timestamptz,
  notes          text,
  constraint unique_pass_number unique(pass_number),
  constraint valid_email check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

-- Enable Row Level Security (RLS) on the table.  When RLS is enabled,
-- no data is returned by the API using the public anon key unless a
-- policy explicitly allows it, as explained in the Supabase docs【327859459575962†L282-L340】.
alter table public.press_passes enable row level security;

-- Policies:
-- 1. Allow authenticated users to insert a new press pass for their own email.
create policy "Allow insert of press passes" on public.press_passes
  for insert
  to authenticated
  with check (auth.jwt() ->> 'email' = email);

-- 2. Allow administrators to view all press passes.
-- Replace 'roles' or 'claims' check with your preferred admin check.
create policy "Admin can view all press passes" on public.press_passes
  for select
  to authenticated
  using (exists (select 1 where auth.jwt() ->> 'role' = 'admin'));

-- 3. Allow administrators to update or revoke passes.
create policy "Admin can update press passes" on public.press_passes
  for update
  to authenticated
  using (exists (select 1 where auth.jwt() ->> 'role' = 'admin'));