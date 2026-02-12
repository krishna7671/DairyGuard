-- Add estimated_bacteria column to sensor_data table
alter table public.sensor_data 
add column estimated_bacteria float;

-- Optional: Update existing rows to have a default value if needed, or leave null
-- update public.sensor_data set estimated_bacteria = 0 where estimated_bacteria is null;
