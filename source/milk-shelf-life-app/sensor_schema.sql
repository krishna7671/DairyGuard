-- Create table for simulated sensor data
create table public.sensor_data (
  id uuid default gen_random_uuid() primary key,
  batch_id text not null,
  temperature float not null,
  ph float not null,
  humidity float not null,
  storage_time integer not null, -- in minutes or hours
  bacterial_risk float not null,
  timestamp timestamptz default now() not null
);

-- Enable Row Level Security (RLS)
alter table public.sensor_data enable row level security;

-- Create policy to allow public read access
create policy "Enable read access for all users" on public.sensor_data
  for select using (true);

-- Create policy to allow public insert access (for simulation demo)
create policy "Enable insert access for all users" on public.sensor_data
  for insert with check (true);

-- Enable Realtime
alter publication supabase_realtime add table public.sensor_data;
