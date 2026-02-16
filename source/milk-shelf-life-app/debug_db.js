
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nitfmcinwbdlxcouajkw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGZtY2lud2JkbHhjb3Vhamt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDc2NTAsImV4cCI6MjA3NzcyMzY1MH0.nHRVUfD7s2L3sQ6owFH3gq38k32-LzwtCdP-2HRfJeg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    console.log('--- SENSORS TABLE ---')
    const { data: sensors, error: sErr } = await supabase.from('sensors').select('*')
    if (sErr) console.error(sErr)
    else console.table(sensors)

    console.log('\n--- READINGS FOR LATEST BATCH ---')
    // Get the latest batch ID from predictions
    const { data: latestPred } = await supabase
        .from('shelf_life_predictions')
        .select('batch_id')
        .order('last_updated', { ascending: false })
        .limit(1)

    if (latestPred && latestPred.length > 0) {
        const batchId = latestPred[0].batch_id
        console.log('Checking readings for:', batchId)

        const { data: readings, error: rErr } = await supabase
            .from('sensor_readings')
            .select('*')
            .eq('batch_id', batchId)

        if (rErr) console.error(rErr)
        else {
            console.table(readings)
            console.log('Count:', readings.length)
        }
    }

    console.log('\n--- LATEST PREDICTIONS ---')
    const { data: preds, error: pErr } = await supabase
        .from('shelf_life_predictions')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(5)
    if (pErr) console.error(pErr)
    else console.table(preds)
}

main()
