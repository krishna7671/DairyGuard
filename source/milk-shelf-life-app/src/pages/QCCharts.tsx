import { useState, useEffect } from 'react'
import { Download, Filter } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine
} from 'recharts'

const chartTypes = [
  { id: 'pareto', name: 'Pareto' },
  { id: 'xbar-r', name: 'X-bar/R' },
  { id: 'fishbone', name: 'Fishbone' },
  { id: 'histogram', name: 'Histogram' },
  { id: 'scatter', name: 'Scatter' },
  { id: 'p-chart', name: 'P-Chart' },
  { id: 'c-chart', name: 'C-Chart' },
]

export default function QCCharts() {
  const [activeChart, setActiveChart] = useState('pareto')
  const [qcData, setQcData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQCData()
  }, [])

  // Define simulated data outside useEffect to use for merging
  const getSimulatedData = () => [
    {
      chart_type: 'pareto',
      data_points: [
        { defect: 'Packaging Seal Failure', count: 180, cumulative: 42.8 },
        { defect: 'Raw Milk Temp Deviation', count: 110, cumulative: 69.0 },
        { defect: 'Off-flavor', count: 70, cumulative: 85.7 },
        { defect: 'Fill Weight', count: 40, cumulative: 95.2 },
        { defect: 'Contamination', count: 20, cumulative: 100.0 }
      ]
    },
    {
      chart_type: 'xbar_control',
      data_points: Array.from({ length: 25 }, (_, i) => ({
        sample: i + 1,
        value: 6.7 + (Math.random() - 0.5) * 0.15, // Tight control around pH 6.7
        ucl: 6.9,
        lcl: 6.5,
        mean: 6.7
      }))
    },
    {
      chart_type: 'xbar-r',
      data_points: Array.from({ length: 25 }, (_, i) => ({
        sample: i + 1,
        value: 4.0 + (Math.random() - 0.5) * 0.8, // Temp fluctuation around 4°C
        range: Math.random() * 0.5,
        ucl: 5.0,
        lcl: 3.0,
        mean: 4.0
      }))
    },
    {
      chart_type: 'histogram',
      data_points: [
        { range: '2.0-2.5', count: 5 },
        { range: '2.5-3.0', count: 12 },
        { range: '3.0-3.5', count: 28 },
        { range: '3.5-4.0', count: 45 }, // Peak at correct temp
        { range: '4.0-4.5', count: 22 },
        { range: '4.5-5.0', count: 8 },
        { range: '5.0+', count: 3 }
      ]
    },
    {
      chart_type: 'scatter',
      data_points: Array.from({ length: 50 }, () => {
        const temp = 3 + Math.random() * 8; // 3 to 11 degrees
        // Higher temp = Higher bacteria (Exponential relationship)
        const bacteria = Math.exp(temp / 2) * 500 + (Math.random() * 5000);
        return { x: parseFloat(temp.toFixed(1)), y: Math.round(bacteria) };
      })
    },
    {
      chart_type: 'p-chart', // Fixed ID to match chartTypes
      data_points: Array.from({ length: 20 }, (_, i) => ({
        sample: i + 1,
        proportion: 0.02 + (Math.random() * 0.03), // 2-5% defect rate
        ucl: 0.06,
        lcl: 0.0,
        centerLine: 0.035
      }))
    },
    {
      chart_type: 'c-chart',
      data_points: Array.from({ length: 20 }, (_, i) => ({
        sample: i + 1,
        defects: Math.floor(1 + Math.random() * 5), // 1-6 defects per batch
        ucl: 8,
        lcl: 0,
        centerLine: 3
      }))
    },
    {
      chart_type: 'fishbone',
      data_points: [{ id: 'template', value: 1 }] // Dummy data to pass empty check
    }
  ]

  const fetchQCData = async () => {
    try {
      const { data } = await supabase
        .from('qc_charts_data')
        .select('*')
        .order('created_at', { ascending: false })

      const simulated = getSimulatedData()

      if (data && data.length > 0) {
        // MERGE STRATEGY: Use real data if available, fallback to simulation for missing types
        // Create a map of latest real data for each type
        const realDataMap = new Map()
        // data is ordered by created_at desc, so first entry for a type is the latest
        data.forEach((item: any) => {
          if (!realDataMap.has(item.chart_type)) {
            realDataMap.set(item.chart_type, item)
          }
        })

        // Map over simulated data structure to ensure we have all types covered
        // If real data exists for a type AND has points, use it; otherwise allow the simulation to stand
        const mergedData = simulated.map(simItem => {
          const realItem = realDataMap.get(simItem.chart_type)
          if (realItem && realItem.data_points && Array.isArray(realItem.data_points) && realItem.data_points.length > 0) {
            return realItem
          }
          return simItem
        })

        // Also append any real data types that might not be in our simulated list (if any)
        // (Optional, but good for completeness)

        setQcData(mergedData)
      } else {
        setQcData(simulated)
      }
    } catch (error) {
      console.error('Error fetching QC data:', error)
      setQcData(getSimulatedData())
    } finally {
      setLoading(false)
    }
  }

  // Removed generateSimulatedQCData as it is now getSimulatedData inside component scope or hoisted


  const getChartData = (type: string) => {
    // Find the latest chart data for this type
    const chartEntry = qcData.find(d => d.chart_type === type)
    if (!chartEntry) return []
    return chartEntry.data_points || []
  }

  const renderChart = () => {
    const data = getChartData(activeChart)

    // If no data exists for this chart type, show placeholder or fallback to demo if prefered
    // For now, we show a message if no data is found
    if (data.length === 0 && !loading) {
      return (
        <div className="h-[400px] flex flex-col items-center justify-center text-neutral-500">
          <p className="mb-4">No data available for this chart type yet.</p>
          <p className="text-small">Add a product to generate initial QC data.</p>
        </div>
      )
    }

    switch (activeChart) {
      case 'pareto':
        return (
          <div>
            <div className="mb-32">
              <h3 className="text-title font-semibold text-neutral-900 mb-16">Pareto Analysis</h3>
              <p className="text-body text-neutral-700">
                Identifies the most significant defect types following the 80/20 rule
              </p>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="defect"
                  stroke="#A3A3A3"
                  angle={-15}
                  textAnchor="end"
                  height={100}
                  style={{ fontSize: '14px' }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#A3A3A3"
                  style={{ fontSize: '14px' }}
                  label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#A3A3A3"
                  style={{ fontSize: '14px' }}
                  label={{ value: 'Cumulative %', angle: 90, position: 'insideRight' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="count" fill="#0066FF" name="Defect Count" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#EF4444"
                  strokeWidth={3}
                  name="Cumulative %"
                  dot={{ fill: '#EF4444', r: 5 }}
                />
                <ReferenceLine yAxisId="right" y={80} stroke="#10B981" strokeDasharray="5 5" label="80%" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )

      case 'xbar_control':
      case 'xbar-r': // Handle both casing if needed
        return (
          <div>
            <div className="mb-32">
              <h3 className="text-title font-semibold text-neutral-900 mb-16">X-bar Control Chart</h3>
              <p className="text-body text-neutral-700">
                Monitors process mean with upper and lower control limits
              </p>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="sample"
                  stroke="#A3A3A3"
                  label={{ value: 'Sample Number', position: 'insideBottom', offset: -5 }}
                  style={{ fontSize: '14px' }}
                />
                <YAxis
                  stroke="#A3A3A3"
                  domain={['auto', 'auto']}
                  style={{ fontSize: '14px' }}
                  label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ucl"
                  stroke="#EF4444"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  name="UCL"
                  dot={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="mean"
                  stroke="#10B981"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  name="Mean"
                  dot={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="lcl"
                  stroke="#EF4444"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  name="LCL"
                  dot={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0066FF"
                  strokeWidth={3}
                  name="Measured Value"
                  dot={{ fill: '#0066FF', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      case 'fishbone':
        // Fishbone is usually static structure or very complex to map dynamically
        // We'll keep the static structure for now but maybe imply it's a template
        return (
          <div>
            <div className="mb-32">
              <h3 className="text-title font-semibold text-neutral-900 mb-16">Fishbone Diagram (Template)</h3>
              <p className="text-body text-neutral-700">
                Root cause analysis using the 6M categories. This is a static template for reference.
              </p>
            </div>
            <div className="bg-white rounded-lg p-48 border border-neutral-200">
              <div className="text-center mb-48">
                <div className="inline-block bg-critical-500/10 border-2 border-critical-500 rounded-lg px-32 py-16">
                  <p className="text-title font-bold text-critical-700">Milk Quality Issue</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-48">
                <div className="space-y-24">
                  <div className="border-l-4 border-primary pl-24">
                    <h4 className="text-body font-semibold text-neutral-900 mb-8">Methods</h4>
                    <ul className="text-small text-neutral-700 space-y-4">
                      <li>• Inconsistent pasteurization</li>
                      <li>• Variable cooling procedures</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-primary pl-24">
                    <h4 className="text-body font-semibold text-neutral-900 mb-8">Materials</h4>
                    <ul className="text-small text-neutral-700 space-y-4">
                      <li>• Raw milk quality variation</li>
                      <li>• Packaging integrity</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-primary pl-24">
                    <h4 className="text-body font-semibold text-neutral-900 mb-8">Machines</h4>
                    <ul className="text-small text-neutral-700 space-y-4">
                      <li>• Calibration drift</li>
                      <li>• Cleaning cycles</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-24">
                  <div className="border-l-4 border-primary pl-24">
                    <h4 className="text-body font-semibold text-neutral-900 mb-8">Manpower</h4>
                    <ul className="text-small text-neutral-700 space-y-4">
                      <li>• Training gaps</li>
                      <li>• SOP adherence</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-primary pl-24">
                    <h4 className="text-body font-semibold text-neutral-900 mb-8">Measurement</h4>
                    <ul className="text-small text-neutral-700 space-y-4">
                      <li>• Sensor accuracy</li>
                      <li>• Sampling frequency</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-primary pl-24">
                    <h4 className="text-body font-semibold text-neutral-900 mb-8">Environment</h4>
                    <ul className="text-small text-neutral-700 space-y-4">
                      <li>• Ambient temp fluctuations</li>
                      <li>• Storage humidity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'histogram':
        return (
          <div>
            <div className="mb-32">
              <h3 className="text-title font-semibold text-neutral-900 mb-16">Histogram</h3>
              <p className="text-body text-neutral-700">
                Frequency distribution of key quality parameters
              </p>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="range"
                  stroke="#A3A3A3"
                  label={{ value: 'Range', position: 'insideBottom', offset: -5 }}
                  style={{ fontSize: '14px' }}
                />
                <YAxis
                  stroke="#A3A3A3"
                  label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
                  style={{ fontSize: '14px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )

      case 'scatter':
        return (
          <div>
            <div className="mb-32">
              <h3 className="text-title font-semibold text-neutral-900 mb-16">Scatter Plot</h3>
              <p className="text-body text-neutral-700">
                Correlation analysis between variables
              </p>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="X"
                  stroke="#A3A3A3"
                  style={{ fontSize: '14px' }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Y"
                  stroke="#A3A3A3"
                  style={{ fontSize: '14px' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                  }}
                />
                <Scatter name="Samples" data={data} fill="#0066FF" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )

      case 'p_chart':
      case 'p-chart':
        return (
          <div>
            <div className="mb-32">
              <h3 className="text-title font-semibold text-neutral-900 mb-16">P-Chart (Proportion Defective)</h3>
              <p className="text-body text-neutral-700">
                Tracks the proportion of defective units in each sample
              </p>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="sample"
                  stroke="#A3A3A3"
                  label={{ value: 'Sample Number', position: 'insideBottom', offset: -5 }}
                  style={{ fontSize: '14px' }}
                />
                <YAxis
                  stroke="#A3A3A3"
                  label={{ value: 'Proportion', angle: -90, position: 'insideLeft' }}
                  style={{ fontSize: '14px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="ucl" stroke="#EF4444" strokeDasharray="5 5" name="UCL" dot={false} connectNulls />
                <Line type="monotone" dataKey="centerLine" stroke="#10B981" strokeDasharray="3 3" name="Center Line" dot={false} connectNulls />
                <Line type="monotone" dataKey="lcl" stroke="#EF4444" strokeDasharray="5 5" name="LCL" dot={false} connectNulls />
                <Line
                  type="monotone"
                  dataKey="proportion"
                  stroke="#0066FF"
                  strokeWidth={3}
                  name="Proportion"
                  dot={{ fill: '#0066FF', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      // ... Add other cases similarly or let them fall to default if not prioritized
      case 'c-chart':
        return (
          <div>
            <div className="mb-32">
              <h3 className="text-title font-semibold text-neutral-900 mb-16">C-Chart (Count of Defects)</h3>
              <p className="text-body text-neutral-700">
                Monitors the total number of defects per sample (constant sample size)
              </p>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="sample"
                  stroke="#A3A3A3"
                  label={{ value: 'Sample Number', position: 'insideBottom', offset: -5 }}
                  style={{ fontSize: '14px' }}
                />
                <YAxis
                  stroke="#A3A3A3"
                  label={{ value: 'Defect Count', angle: -90, position: 'insideLeft' }}
                  style={{ fontSize: '14px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="ucl" stroke="#EF4444" strokeDasharray="5 5" name="UCL" dot={false} connectNulls />
                <Line type="monotone" dataKey="centerLine" stroke="#10B981" strokeDasharray="3 3" name="Center Line" dot={false} connectNulls />
                <Line type="monotone" dataKey="lcl" stroke="#EF4444" strokeDasharray="5 5" name="LCL" dot={false} connectNulls />
                <Line
                  type="monotone"
                  dataKey="defects"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  name="Defects"
                  dot={{ fill: '#8B5CF6', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      default:
        return (
          <div className="h-[400px] flex items-center justify-center text-neutral-500">
            Chart type not fully implemented or data unavailable.
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-background-page py-64 px-32">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16">
            <p className="text-small text-neutral-500">Dashboard / QC Charts</p>
          </div>
          <h1 className="text-title-large font-bold text-neutral-900 mb-24">
            Quality Control Charts
          </h1>
          <p className="text-body-large text-neutral-700 max-w-3xl">
            Interactive dashboard with 7 statistical process control charts for comprehensive quality analysis
          </p>
        </div>
      </section>

      {/* Simulation Disclaimer Banner */}
      <div className="bg-blue-50 border-y border-blue-200 px-32 py-12">
        <div className="container mx-auto max-w-7xl flex items-center justify-center gap-2">
          <span className="text-xl">ℹ️</span>
          <p className="text-sm font-medium text-blue-800">
            <strong>SIMULATED DATA MODE:</strong> The charts below are visualized using synthetic data based on scientific principles (Arrhenius & Q10 models) for demonstration purposes.
          </p>
        </div>
      </div>

      {/* Chart Display Area */}
      <section className="py-64 px-32 bg-background-surface">
        <div className="container mx-auto max-w-7xl">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-8 mb-32 border-b border-neutral-200">
            {chartTypes.map((chart) => (
              <button
                key={chart.id}
                onClick={() => setActiveChart(chart.id)}
                className={`px-24 py-12 text-body font-medium transition-all duration-base rounded-t-md ${activeChart === chart.id
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
              >
                {chart.name}
              </button>
            ))}
          </div>

          {/* Control Toolbar */}
          <div className="flex items-center gap-16 mb-32 p-16 bg-neutral-100 rounded-md border border-neutral-200">
            <button className="flex items-center gap-2 px-16 py-8 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors">
              <Filter className="h-4 w-4 text-neutral-700" />
              <span className="text-small text-neutral-700">Filter</span>
            </button>
            <button
              onClick={() => alert("Export PDF feature coming in v1.1")}
              className="flex items-center gap-2 px-16 py-8 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
            >
              <Download className="h-4 w-4 text-neutral-700" />
              <span className="text-small text-neutral-700">Export PDF</span>
            </button>
            <button
              onClick={() => alert("Export CSV feature coming in v1.1")}
              className="flex items-center gap-2 px-16 py-8 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
            >
              <Download className="h-4 w-4 text-neutral-700" />
              <span className="text-small text-neutral-700">Export CSV</span>
            </button>
          </div>

          {/* Chart Canvas */}
          <div className="bg-white rounded-lg p-48 shadow-card border border-neutral-200 relative overflow-hidden">
            <div className="absolute top-4 right-4 z-10 bg-neutral-100/80 backdrop-blur-sm border border-neutral-200 px-3 py-1 rounded-full pointer-events-none">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Simulated Data</span>
            </div>
            {renderChart()}
          </div>
        </div>
      </section>
    </div>
  )
}
