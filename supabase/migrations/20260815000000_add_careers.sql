create table if not exists public.careers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique default auth.uid() references auth.users(id) on delete cascade,
  team jsonb not null,
  active_driver text not null,
  budget integer not null check (budget >= 0),
  pace integer not null check (pace >= 0),
  upgrades jsonb not null default '[]'::jsonb,
  round integer not null default 1 check (round between 1 and 24),
  contract_years integer not null default 3 check (contract_years between 0 and 5),
  season_year integer not null default 2026,
  driver_points jsonb not null default '{}'::jsonb,
  driver_rating numeric(5,2) not null default 85 check (driver_rating between 0 and 100),
  races_completed integer not null default 0 check (races_completed between 0 and 24),
  pit_crew_level integer not null default 1 check (pit_crew_level between 1 and 10),
  days_until_race integer not null default 17 check (days_until_race >= 0),
  race_history jsonb not null default '[]'::jsonb,
  sponsor text not null default 'APEX PARTNERS',
  updated_at timestamptz not null default now()
);

alter table public.careers enable row level security;

create policy "Users can read own career" on public.careers
  for select using (auth.uid() = user_id);

create policy "Users can create own career" on public.careers
  for insert with check (auth.uid() = user_id);

create policy "Users can update own career" on public.careers
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
