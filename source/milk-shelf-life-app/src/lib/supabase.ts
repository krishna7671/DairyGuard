import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Edge function URLs
export const EDGE_FUNCTIONS = {
  ML_PREDICTION: 'https://nitfmcinwbdlxcouajkw.supabase.co/functions/v1/ml_prediction',
  DATA_PROCESSOR: 'https://nitfmcinwbdlxcouajkw.supabase.co/functions/v1/data_processor',
  QC_CHARTS_GENERATOR: 'https://nitfmcinwbdlxcouajkw.supabase.co/functions/v1/qc_charts_generator',
  DAIRY_DOCTOR: 'https://nitfmcinwbdlxcouajkw.supabase.co/functions/v1/dairy-doctor',
}
