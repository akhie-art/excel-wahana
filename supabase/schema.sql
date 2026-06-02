-- Create user progress table
create table public.user_progress (
  user_id uuid references auth.users(id) on delete cascade primary key,
  current_module_id text not null default 'basics',
  current_step_id text not null default 'sum-basics',
  completed_steps text[] not null default '{}',
  streak_count integer not null default 0,
  last_active_at timestamp with time zone not null default timezone('utc'::text, now()),
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  role text not null default 'peserta' check (role in ('peserta', 'instruktur'))
);

-- Enable RLS
alter table public.user_progress enable row level security;

-- Policies
create policy "Users can view own progress" on public.user_progress
  for select using (auth.uid() = user_id);

create policy "Users can insert own progress" on public.user_progress
  for insert with check (auth.uid() = user_id);

create policy "Users can update own progress" on public.user_progress
  for update using (auth.uid() = user_id);

-- Profile trigger to create progress on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_progress (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger for updating updated_at timestamp
create or replace function public.handle_update_timestamp()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create or replace trigger on_user_progress_updated
  before update on public.user_progress
  for each row execute procedure public.handle_update_timestamp();
