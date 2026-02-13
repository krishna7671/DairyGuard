-- Corrected Schema based on Application Code
-- Run this in your Supabase SQL Editor

-- 1. Sensors Table
CREATE TABLE IF NOT EXISTS public.sensors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sensor_id TEXT NOT NULL, -- Logical ID like 'TEMP-001'
    sensor_type TEXT NOT NULL, -- 'Temperature', 'pH', 'Bacteria', 'Humidity'
    status TEXT DEFAULT 'active',
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Milk Batches Table
CREATE TABLE IF NOT EXISTS public.milk_batches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    batch_id TEXT NOT NULL UNIQUE, -- User-facing ID like 'BATCH-2024-001'
    milk_type TEXT NOT NULL,
    fat_content FLOAT,
    protein_content FLOAT,
    ph_level FLOAT,
    production_date TIMESTAMPTZ,
    expiration_date TIMESTAMPTZ,
    processing_temp FLOAT,
    storage_temp FLOAT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sensor Readings Table (Linked to Sensors)
CREATE TABLE IF NOT EXISTS public.sensor_readings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sensor_id UUID REFERENCES public.sensors(id),
    batch_id TEXT, -- Can link to milk_batches.batch_id or be loose
    milk_type TEXT,
    value FLOAT NOT NULL,
    unit TEXT,
    quality_flag TEXT DEFAULT 'normal', -- 'normal', 'warning', 'critical'
    temperature_celsius FLOAT, -- Snapshot of temp during reading if relevant
    humidity_percent FLOAT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Shelf Life Predictions Table
CREATE TABLE IF NOT EXISTS public.shelf_life_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    batch_id TEXT, -- Links to milk_batches.batch_id
    predicted_shelf_life_hours FLOAT,
    confidence_lower FLOAT,
    confidence_upper FLOAT,
    prediction_method TEXT,
    accuracy_score FLOAT,
    risk_factors TEXT[], -- Array of strings
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. QC Charts Data Table
CREATE TABLE IF NOT EXISTS public.qc_charts_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chart_type TEXT NOT NULL, -- 'pareto', 'xbar_control', etc.
    data_points JSONB, -- Stored as JSON for flexibility
    control_limits JSONB,
    parameters JSONB,
    time_period_hours INTEGER,
    batch_filter TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) - Enable for all
ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milk_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shelf_life_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qc_charts_data ENABLE ROW LEVEL SECURITY;

-- Policies (Public Access for Demo Purposes - Tighten for Production)
CREATE POLICY "Public read sensors" ON public.sensors FOR SELECT USING (true);
CREATE POLICY "Public insert sensors" ON public.sensors FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read batches" ON public.milk_batches FOR SELECT USING (true);
CREATE POLICY "Public insert batches" ON public.milk_batches FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read readings" ON public.sensor_readings FOR SELECT USING (true);
CREATE POLICY "Public insert readings" ON public.sensor_readings FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read predictions" ON public.shelf_life_predictions FOR SELECT USING (true);
CREATE POLICY "Public insert predictions" ON public.shelf_life_predictions FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read qc data" ON public.qc_charts_data FOR SELECT USING (true);
CREATE POLICY "Public insert qc data" ON public.qc_charts_data FOR INSERT WITH CHECK (true);

-- Seed Initial Sensors if empty
INSERT INTO public.sensors (sensor_id, sensor_type, location)
SELECT 'TEMP-01', 'Temperature', 'Cold Storage A'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Temperature');

INSERT INTO public.sensors (sensor_id, sensor_type, location)
SELECT 'PH-01', 'pH', 'Cold Storage A'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'pH');

INSERT INTO public.sensors (sensor_id, sensor_type, location)
SELECT 'BAC-01', 'Bacteria', 'Lab Unit 1'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Bacteria');

INSERT INTO public.sensors (sensor_id, sensor_type, location)
SELECT 'HUM-01', 'Humidity', 'Cold Storage A'
WHERE NOT EXISTS (SELECT 1 FROM public.sensors WHERE sensor_type = 'Humidity');
