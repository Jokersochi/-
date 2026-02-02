-- Supabase SQL bootstrap for full-stack generation jobs
-- Run in Supabase SQL editor. Review RLS policies for production.

-- Ensure UUID generation is available
create extension if not exists pgcrypto;

-- Generation jobs table
create table if not exists public.generation_jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  status text not null default 'queued', -- queued | running | succeeded | failed
  style text,

  input_image_url text,
  output_image_url text,

  replicate_prediction_id text,
  error text
);

create index if not exists generation_jobs_created_at_idx on public.generation_jobs (created_at desc);
create index if not exists generation_jobs_status_idx on public.generation_jobs (status);
create index if not exists generation_jobs_replicate_prediction_id_idx on public.generation_jobs (replicate_prediction_id);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_generation_jobs_updated_at on public.generation_jobs;
create trigger set_generation_jobs_updated_at
before update on public.generation_jobs
for each row
execute function public.set_updated_at();

-- NOTE: For production, enable RLS and add policies per authenticated user.
-- For MVP, keep DB writes only from server using SUPABASE_SERVICE_ROLE_KEY.

