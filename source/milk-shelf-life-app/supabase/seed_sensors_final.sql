-- Final fixed seed for sensors table
-- Explicitly providing UUIDs for sensor_id to satisfy not-null constraint
-- Using static UUIDs to avoid function dependencies

INSERT INTO public.sensors (sensor_id, sensor_type, status, location)
SELECT '11111111-1111-1111-1111-111111111111', 'Temperature', 'active', 'Storage Unit A'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Temperature');

INSERT INTO public.sensors (sensor_id, sensor_type, status, location)
SELECT '22222222-2222-2222-2222-222222222222', 'pH', 'active', 'Storage Unit A'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'pH');

INSERT INTO public.sensors (sensor_id, sensor_type, status, location)
SELECT '33333333-3333-3333-3333-333333333333', 'Bacteria', 'active', 'Lab Test Station'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Bacteria');

INSERT INTO public.sensors (sensor_id, sensor_type, status, location)
SELECT '44444444-4444-4444-4444-444444444444', 'Humidity', 'active', 'Storage Unit A'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Humidity');
