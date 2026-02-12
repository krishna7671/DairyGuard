-- Fixed seed for sensors table
-- Explicitly generates sensor_id to satisfy not-null constraint
-- We use gen_random_uuid() for both id and sensor_id just to be safe

INSERT INTO public.sensors (sensor_id, sensor_type, status, location)
SELECT gen_random_uuid(), 'Temperature', 'active', 'Storage Unit A'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Temperature');

INSERT INTO public.sensors (sensor_id, sensor_type, status, location)
SELECT gen_random_uuid(), 'pH', 'active', 'Storage Unit A'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'pH');

INSERT INTO public.sensors (sensor_id, sensor_type, status, location)
SELECT gen_random_uuid(), 'Bacteria', 'active', 'Lab Test Station'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Bacteria');

INSERT INTO public.sensors (sensor_type, status, location)
-- Try inserting without sensor_id if it has a default, but likely we need it.
-- Actually, let's stick to the pattern that worked for the ID in the error log (it generated one ID but missed the other).
-- If sensor_id is the issue, we must supply it.
SELECT gen_random_uuid(), 'Humidity', 'active', 'Storage Unit A'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Humidity');
