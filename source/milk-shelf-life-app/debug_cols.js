
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nitfmcinwbdlxcouajkw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGZtY2lud2JkbHhjb3Vhamt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDc2NTAsImV4cCI6MjA3NzcyMzY1MH0.nHRVUfD7s2L3sQ6owFH3gq38k32-LzwtCdP-2HRfJeg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    console.log('--- READINGS COLUMN CHECK ---')
    // Try to insert a dummy row to see error, or just select one row
    const { data: readings, error: rErr } = await supabase
        .from('sensor_readings')
        .select('*')
        .limit(1)

    if (rErr) {
        console.error(rErr)
    } else if (readings.length > 0) {
        console.log('Keys:', Object.keys(readings[0]))
    } else {
        console.log('No readings found to key off of.')
    }
}

main()
