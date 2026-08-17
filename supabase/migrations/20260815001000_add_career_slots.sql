alter table public.careers drop constraint if exists careers_user_id_key;
alter table public.careers add column if not exists slot smallint not null default 1 check (slot between 1 and 4);
alter table public.careers add constraint careers_user_slot_key unique (user_id, slot);
create policy "Users can delete own career" on public.careers for delete using (auth.uid() = user_id);
