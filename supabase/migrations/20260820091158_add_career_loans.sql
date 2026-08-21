create table public.career_loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  career_slot smallint not null check (career_slot between 1 and 4),
  amount_millions integer not null check (amount_millions between 1 and 100),
  reason text not null check (char_length(reason) between 25 and 500),
  term_races smallint not null check (term_races between 1 and 24),
  remaining_races smallint not null check (remaining_races between 0 and 24),
  repayment_millions integer not null check (repayment_millions >= amount_millions),
  status text not null default 'active' check (status in ('active', 'repaid', 'defaulted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index career_loans_user_slot_idx on public.career_loans (user_id, career_slot);
create unique index career_loans_one_active_per_career_idx
  on public.career_loans (user_id, career_slot)
  where status = 'active';

alter table public.career_loans enable row level security;
revoke all on public.career_loans from anon, authenticated;
grant select, insert, update on public.career_loans to authenticated;

create policy "Users can view own loans" on public.career_loans
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create own loans" on public.career_loans
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own loans" on public.career_loans
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
