-- Seed the sensors table if empty
-- Note: 'unit' column was removed as it doesn't exist in the schema
INSERT INTO public.sensors (sensor_type, location, status)
SELECT 'Temperature', 'Storage Unit A', 'active'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Temperature');

INSERT INTO public.sensors (sensor_type, location, status)
SELECT 'pH', 'Storage Unit A', 'active'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'pH');

INSERT INTO public.sensors (sensor_type, location, status)
SELECT 'Bacteria', 'Lab Test Station', 'active'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Bacteria');

INSERT INTO public.sensors (sensor_type, location, status)
SELECT 'Humidity', 'Storage Unit A', 'active'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Humidity');
