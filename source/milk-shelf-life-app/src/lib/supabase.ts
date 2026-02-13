import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Edge function URLs
// Edge function URLs
const FUNCTION_BASE_URL = import.meta.env.VITE_SUPABASE_FUNCTION_URL || 'https://your-project-ref.supabase.co/functions/v1'

export const EDGE_FUNCTIONS = {
  ML_PREDICTION: `${FUNCTION_BASE_URL}/ml_prediction`,
  DATA_PROCESSOR: `${FUNCTION_BASE_URL}/data_processor`,
  QC_CHARTS_GENERATOR: `${FUNCTION_BASE_URL}/qc_charts_generator`,
  DAIRY_DOCTOR: `${FUNCTION_BASE_URL}/dairy-doctor`,
}
