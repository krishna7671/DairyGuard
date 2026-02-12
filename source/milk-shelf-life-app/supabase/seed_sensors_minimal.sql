-- Minimal seed for sensors table
-- Only inserts sensor_type to avoid column mismatch errors
-- If this fails with "null value in column...", report that column name

INSERT INTO public.sensors (sensor_type)
SELECT 'Temperature'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Temperature');

INSERT INTO public.sensors (sensor_type)
SELECT 'pH'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'pH');

INSERT INTO public.sensors (sensor_type)
SELECT 'Bacteria'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Bacteria');

INSERT INTO public.sensors (sensor_type)
SELECT 'Humidity'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Humidity');
