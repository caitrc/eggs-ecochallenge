-- Run this in your Supabase SQL editor (supabase.com → your project → SQL editor)

-- Students table
create table students (
  id uuid default gen_random_uuid() primary key,
  nickname text not null,
  tutor_class text not null,
  total_points integer default 0,
  team_id uuid references teams(id),
  created_at timestamptz default now(),
  unique(nickname, tutor_class)
);

-- Teams table (create before students since students references it)
create table teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  total_points integer default 0,
  member_count integer default 0,
  created_at timestamptz default now()
);

-- Student challenges (which challenges a student has joined)
create table student_challenges (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references students(id),
  challenge_id integer not null,
  log_count integer default 0,
  joined_at timestamptz default now(),
  unique(student_id, challenge_id)
);

-- Logs (each time someone logs a challenge)
create table logs (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references students(id),
  challenge_id integer not null,
  points integer not null,
  logged_date date not null,
  created_at timestamptz default now()
);

-- Enable public read/write (fine for a school challenge with no sensitive data)
alter table students enable row level security;
alter table teams enable row level security;
alter table student_challenges enable row level security;
alter table logs enable row level security;

create policy "Public read" on students for select using (true);
create policy "Public insert" on students for insert with check (true);
create policy "Public update" on students for update using (true);

create policy "Public read" on teams for select using (true);
create policy "Public update" on teams for update using (true);

create policy "Public read" on student_challenges for select using (true);
create policy "Public insert" on student_challenges for insert with check (true);
create policy "Public update" on student_challenges for update using (true);

create policy "Public read" on logs for select using (true);
create policy "Public insert" on logs for insert with check (true);

-- Add some starter teams (edit these to match your school's house/team names!)
insert into teams (name, description) values
  ('Green Giants', 'For the eco warriors of EGGS'),
  ('Blue Planet', 'Protecting our oceans and waterways'),
  ('Solar Squad', 'Harnessing clean energy vibes'),
  ('Recyclers', 'Zero waste champions'),
  ('Earth Guardians', 'Defending our natural world');
