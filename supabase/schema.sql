-- Drop existing triggers and tables if they exist to allow re-running the script cleanly
drop trigger if exists on_auth_user_created on auth.users;
drop table if exists public.custom_steps cascade;
drop table if exists public.user_progress cascade;

-- Create user progress table
create table public.user_progress (
  user_id uuid references auth.users(id) on delete cascade primary key,
  email text,
  name text,
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
create policy "Users can view own progress or instructors can view all" on public.user_progress
  for select using (
    auth.uid() = user_id 
    or auth.jwt() ->> 'email' = 'instruktur@excel.com' 
    or auth.jwt() ->> 'email' like '%instruktur%'
  );

create policy "Users can insert own progress" on public.user_progress
  for insert with check (auth.uid() = user_id);

create policy "Users can update own progress" on public.user_progress
  for update using (auth.uid() = user_id);

-- Profile trigger to create progress on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_progress (user_id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
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


-- Create custom steps table for instructor persistence
create table public.custom_steps (
  id text primary key,
  module_id text not null,
  title text not null,
  short_description text not null,
  concept_explanation text not null,
  instructions text not null,
  headers text[] not null,
  dummy_data jsonb not null,
  valid_formulas text[] not null,
  expected_result text not null,
  result_cell jsonb not null,
  hint text not null,
  tasks jsonb default '[]'::jsonb,
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.custom_steps enable row level security;

-- Policies for custom_steps
create policy "Anyone can view custom steps" on public.custom_steps
  for select using (true);

create policy "Authenticated users can insert custom steps" on public.custom_steps
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can delete custom steps" on public.custom_steps
  for delete using (auth.role() = 'authenticated');
