-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create 'workouts' table (One row per session)
create table workouts (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  raw_transcript text, 
  user_notes text, -- e.g. "Shoulder hurt"
  difficulty integer, -- 1-10
  date date default CURRENT_DATE
);

-- 3. Create 'exercises' table (Many rows per workout)
create table exercises (
  id uuid default uuid_generate_v4() primary key,
  workout_id uuid references workouts(id) on delete cascade not null,
  name text not null, -- "Bench Press", "Sauna"
  sets integer,
  reps integer,
  weight numeric, -- 135.5
  unit text default 'lbs', -- 'lbs', 'kg'
  duration_seconds integer, -- for Plank/Sauna
  progression text, -- "Tuck Front Lever"
  muscle_group text -- "Chest", "Back" (Can be added by AI later)
);

-- 4. Create RLS Policies (Start Open, then restrict if Auth added)
alter table workouts enable row level security;
alter table exercises enable row level security;

-- Allow public read/write for now (Development Mode)
create policy "Public workouts" on workouts for all using (true);
create policy "Public exercises" on exercises for all using (true);
