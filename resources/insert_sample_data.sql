-- Insert sample sensor data
INSERT INTO sensors (sensor_id, sensor_type, location, status, last_reading, accuracy, range_min, range_max) VALUES
('TEMP-001', 'Temperature', 'Tank A', 'active', NOW(), 0.5, -10, 85),
('PH-001', 'pH', 'Tank A', 'active', NOW(), 0.1, 2, 13),
('BACT-001', 'Bacteria', 'Tank A', 'active', NOW(), 5, 0, 1000000),
('HUM-001', 'Humidity', 'Storage Room', 'active', NOW(), 1.5, 0, 100);

-- Insert sample sensor readings
INSERT INTO sensor_readings (sensor_id, value, unit, quality_flag, temperature_celsius, humidity_percent, batch_id, milk_type)
SELECT 
  s.id,
  CASE 
    WHEN s.sensor_type = 'Temperature' THEN 4.5
    WHEN s.sensor_type = 'pH' THEN 6.8
    WHEN s.sensor_type = 'Bacteria' THEN 50000
    WHEN s.sensor_type = 'Humidity' THEN 65
  END,
  CASE 
    WHEN s.sensor_type = 'Temperature' THEN '°C'
    WHEN s.sensor_type = 'pH' THEN 'pH'
    WHEN s.sensor_type = 'Bacteria' THEN 'CFU/ml'
    WHEN s.sensor_type = 'Humidity' THEN '%'
  END,
  'normal',
  4.5,
  65,
  'BATCH-' || (1000 + (random() * 100)::int),
  (ARRAY['Whole', '2%', 'Fat-Free'])[floor(random() * 3 + 1)]
FROM sensors s;

-- Insert sample shelf life predictions
INSERT INTO shelf_life_predictions (batch_id, predicted_hours, confidence_lower, confidence_upper, accuracy_score, risk_factors)
VALUES
('BATCH-1001', 120, 96, 144, 94, ARRAY['Temperature stable', 'pH within normal range']),
('BATCH-1002', 108, 86, 130, 92, ARRAY['Slightly elevated temperature']),
('BATCH-1003', 132, 106, 158, 96, ARRAY['Optimal conditions']),
('BATCH-1004', 96, 77, 115, 90, ARRAY['Temperature abuse detected', 'Higher bacterial count']),
('BATCH-1005', 114, 91, 137, 93, ARRAY['pH indicating spoilage onset']);

-- Insert sample alerts
INSERT INTO alerts (severity, message, sensor_type, sensor_id, threshold_value, actual_value, resolved)
SELECT 
  (ARRAY['critical', 'warning', 'info'])[floor(random() * 3 + 1)],
  'Temperature deviation detected in ' || s.location,
  s.sensor_type,
  s.sensor_id,
  6.0,
  7.2,
  false
FROM sensors s
WHERE s.sensor_type = 'Temperature'
LIMIT 2;

INSERT INTO alerts (severity, message, sensor_type, sensor_id, threshold_value, actual_value, resolved)
VALUES
('warning', 'pH level approaching warning threshold', 'pH', 'PH-001', 6.7, 6.6, false),
('info', 'Bacteria count within normal range', 'Bacteria', 'BACT-001', 100000, 50000, true);
