import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { chartType, batchIds, timePeriodHours } = await req.json()
        const data = []
        let parameters = {}

        if (chartType === 'xbar_control' || chartType === 'xbar-r') {
            const mean = 6.8
            const ucl = 7.0
            const lcl = 6.6
            // Generate 20 sample points
            for (let i = 1; i <= 20; i++) {
                const variation = (Math.random() - 0.5) * 0.3
                data.push({
                    sample: i,
                    value: parseFloat((mean + variation).toFixed(2)),
                    ucl,
                    lcl,
                    mean
                })
            }
            parameters = { mean, ucl, lcl }
        }
        else if (chartType === 'histogram') {
            // Mock fat content distribution
            const ranges = ['2.0-2.5', '2.5-3.0', '3.0-3.5', '3.5-4.0', '4.0-4.5', '4.5-5.0', '5.0+']
            ranges.forEach(range => {
                data.push({
                    range,
                    count: Math.floor(Math.random() * 50) + 5
                })
            })
        }
        else if (chartType === 'scatter') {
            // Temperature vs Bacteria correlation
            for (let i = 0; i < 50; i++) {
                const x = parseFloat((4 + Math.random() * 6).toFixed(1)) // Temp 4-10
                const y = Math.floor(x * 15000 + (Math.random() - 0.5) * 20000) // Bacteria correlates with temp
                data.push({ x, y })
            }
        }
        else if (chartType === 'pareto') {
            const defects = [
                { defect: 'Packaging Seal Failure', count: 180 },
                { defect: 'Raw Milk Temp Deviation', count: 110 },
                { defect: 'Off-flavor', count: 70 },
                { defect: 'Fill Weight', count: 40 },
                { defect: 'Contamination', count: 30 }
            ]
            let cumulativeCount = 0
            const total = defects.reduce((sum, d) => sum + d.count, 0)

            defects.forEach(d => {
                cumulativeCount += d.count
                data.push({
                    defect: d.defect,
                    count: d.count,
                    cumulative: parseFloat(((cumulativeCount / total) * 100).toFixed(1))
                })
            })
        }
        else if (chartType === 'p_chart' || chartType === 'p-chart') {
            const p = 0.05
            const n = 100
            const ucl = p + 3 * Math.sqrt(p * (1 - p) / n)
            const lcl = Math.max(0, p - 3 * Math.sqrt(p * (1 - p) / n))

            for (let i = 1; i <= 20; i++) {
                data.push({
                    sample: i,
                    proportion: parseFloat((p + (Math.random() - 0.5) * 0.03).toFixed(3)),
                    ucl,
                    lcl,
                    centerLine: p
                })
            }
        }

        return new Response(
            JSON.stringify({ data: { data, parameters } }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
