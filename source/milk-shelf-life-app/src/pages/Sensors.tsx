import { useEffect, useState, useRef, useCallback } from 'react'
import { Thermometer, Droplets, Activity, Wifi, Clock, CloudRain, Database, RefreshCw, Cpu, BrainCircuit } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SensorData {
  temperature: number
  ph: number
  humidity: number
  storage_time: number
  estimated_bacteria: number
  risk_level: string
  timestamp: string
}

export default function Sensors() {
  const [data, setData] = useState<SensorData | null>(null)
  const [history, setHistory] = useState<SensorData[]>([])
  const [isSimulating, setIsSimulating] = useState(true)
  const [batchId] = useState(`BATCH-${Math.floor(Math.random() * 10000)}`)

  // Simulation State Refs
  const storageTimeRef = useRef(0)
  const bacteriaCountRef = useRef(5000) // Start with low count (5,000 CFU/ml)

  const SIMULATION_INTERVAL = 5000 // 5 seconds


  const generateSimulatedData = useCallback((prevStorageTime: number): SensorData => {
    // Increment storage time
    const newStorageTime = prevStorageTime + 1
    storageTimeRef.current = newStorageTime

    // Simulate Temperature: Fluctuate between 3.5 and 8.0
    // Base 4.0 + random noise
    const rawTemp = 3.5 + Math.random() * 4.5

    // Simulate pH: Gradual decay
    const phDecay = (newStorageTime * 0.005)
    const rawPh = Math.max(6.0, 6.8 - phDecay + (Math.random() * 0.1 - 0.05))

    // Simulate Humidity: 70-85%
    const rawHumidity = 70 + Math.random() * 15

    // --- AI-Based Bacterial Growth Model ---
    // Formula: N_t = N_0 * (1 + growth_rate)

    let growthRate = 0.02 // Base very slow growth at <4C

    if (rawTemp > 8.0) {
      growthRate = 0.15 // Rapid exponential growth
    } else if (rawTemp > 5.0) {
      growthRate = 0.08 // Moderate growth
    }

    // pH Impact: Acidic environment accelerates spoilage in some contexts, 
    // but simplified model: pH < 6.4 implies existing spoilage -> higher rate
    if (rawPh < 6.4) {
      growthRate *= 1.5
    }

    // Apply growth
    const currentBacteria = bacteriaCountRef.current
    const newBacteria = currentBacteria * (1 + growthRate)

    // Add some random fluctuation (noise) but keep trend
    const noisyBacteria = newBacteria + (Math.random() * 100 - 50)
    bacteriaCountRef.current = Math.max(100, noisyBacteria)

    // Determine Risk Level
    let riskLevel = 'Low'
    if (bacteriaCountRef.current > 200000) riskLevel = 'High'
    else if (bacteriaCountRef.current > 50000) riskLevel = 'Moderate'

    return {
      temperature: Number(rawTemp.toFixed(2)),
      ph: Number(rawPh.toFixed(2)),
      humidity: Number(rawHumidity.toFixed(1)),
      storage_time: newStorageTime,
      estimated_bacteria: Math.round(bacteriaCountRef.current),
      risk_level: riskLevel,
      timestamp: new Date().toISOString()
    }
  }, [])

  const simulateNewReading = useCallback(async () => {
    const newData = generateSimulatedData(storageTimeRef.current)

    // Update State
    setData(newData)
    setHistory(prev => [...prev.slice(-29), newData]) // Keep last 30 points

    // Persist to Supabase
    try {
      const { error } = await supabase.from('sensor_data').insert({
        batch_id: batchId,
        temperature: newData.temperature,
        ph: newData.ph,
        humidity: newData.humidity,
        storage_time: newData.storage_time,
        estimated_bacteria: newData.estimated_bacteria, // New Column
        bacterial_risk: 0, // Legacy/Unused
        timestamp: newData.timestamp
      })

      if (error) console.error('Supabase Insert Error:', error)
    } catch (err) {
      console.error('Simulation Error:', err)
    }
  }, [batchId, generateSimulatedData])

  useEffect(() => {
    // Initial fetch
    const initialData = generateSimulatedData(0)
    setData(initialData)
    setHistory([initialData])

    const interval = setInterval(() => {
      if (isSimulating) {
        simulateNewReading()
      }
    }, SIMULATION_INTERVAL)

    return () => clearInterval(interval)
  }, [isSimulating, simulateNewReading, generateSimulatedData])

  // Helper for status colors
  const getStatusColor = (value: number, type: 'temp' | 'ph' | 'bacteria') => {
    if (type === 'temp') return value > 5.0 ? 'text-critical-500' : 'text-success-500'
    if (type === 'ph') return value < 6.5 ? 'text-warning-500' : 'text-success-500'
    if (type === 'bacteria') return value > 200000 ? 'text-critical-500' : value > 50000 ? 'text-warning-500' : 'text-success-500'
    return 'text-neutral-900'
  }

  if (!data) return <div className="p-32 text-center">Initializing Sensors...</div>

  return (
    <div className="min-h-screen bg-background-page pb-32">
      {/* Header Banner */}
      <div className="bg-indigo-600 text-white px-32 py-12 sticky top-[72px] z-40 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="h-5 w-5 animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-sm">IoT Simulation Mode Active</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-2">
              <Wifi className="h-4 w-4" /> Live Feed
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              Batch: {batchId}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-32 py-32 space-y-32">

        {/* Main Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
          {/* Temperature Card */}
          <div className="bg-white p-24 rounded-xl shadow-sm border border-neutral-100 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-16">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <Thermometer className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-neutral-400 bg-neutral-50 px-2 py-1 rounded">IoT-T1</span>
            </div>
            <h3 className="text-neutral-500 text-sm font-medium mb-4">Milk Temperature</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getStatusColor(data.temperature, 'temp')}`}>
                {data.temperature}°C
              </span>
              <span className="text-sm text-neutral-400">Target: &lt;5°C</span>
            </div>
            <div className="mt-16 h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${data.temperature > 5 ? 'bg-critical-500' : 'bg-blue-500'}`}
                style={{ width: `${(data.temperature / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* pH Card */}
          <div className="bg-white p-24 rounded-xl shadow-sm border border-neutral-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-16">
              <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                <Droplets className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-neutral-400 bg-neutral-50 px-2 py-1 rounded">IoT-P1</span>
            </div>
            <h3 className="text-neutral-500 text-sm font-medium mb-4">pH Level</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getStatusColor(data.ph, 'ph')}`}>
                {data.ph}
              </span>
              <span className="text-sm text-neutral-400">Safe: 6.6-6.8</span>
            </div>
            <div className="mt-16 h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${data.ph < 6.6 ? 'bg-warning-500' : 'bg-purple-500'}`}
                style={{ width: `${((data.ph - 5) / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* AI Estimated Bacteria Card */}
          <div className="bg-white p-24 rounded-xl shadow-sm border border-neutral-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-16">
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-white bg-indigo-500 px-2 py-1 rounded shadow-sm">AI Modeled</span>
            </div>
            <h3 className="text-neutral-500 text-sm font-medium mb-4">Estimated Bacterial Count</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${getStatusColor(data.estimated_bacteria, 'bacteria')}`}>
                {data.estimated_bacteria.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-400">CFU/ml</span>
            </div>
            <div className="mt-8 flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${data.risk_level === 'Low' ? 'bg-success-100 text-success-700' :
                data.risk_level === 'Moderate' ? 'bg-warning-100 text-warning-700' :
                  'bg-critical-100 text-critical-700'
                }`}>
                Risk: {data.risk_level}
              </span>
            </div>
            <div className="mt-16 h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
              {/* Logarithmic scale approx visualization */}
              <div
                className={`h-full transition-all duration-500 ${data.estimated_bacteria > 200000 ? 'bg-critical-500' : data.estimated_bacteria > 50000 ? 'bg-warning-500' : 'bg-success-500'}`}
                style={{ width: `${Math.min(100, (Math.log10(data.estimated_bacteria) / 6) * 100)}%` }}
              />
            </div>
          </div>

          {/* Humidity Card */}
          <div className="bg-white p-24 rounded-xl shadow-sm border border-neutral-100">
            <div className="flex items-center gap-3 mb-8">
              <CloudRain className="h-5 w-5 text-cyan-500" />
              <h3 className="text-neutral-500 text-sm font-medium">Humidity</h3>
            </div>
            <span className="text-2xl font-bold text-neutral-800">{data.humidity}%</span>
          </div>

          {/* Storage Duration Card */}
          <div className="bg-white p-24 rounded-xl shadow-sm border border-neutral-100">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="h-5 w-5 text-orange-500" />
              <h3 className="text-neutral-500 text-sm font-medium">Storage Duration</h3>
            </div>
            <span className="text-2xl font-bold text-neutral-800">{data.storage_time} mins</span>
          </div>

          {/* Last Updated Card */}
          <div className="bg-white p-24 rounded-xl shadow-sm border border-neutral-100">
            <div className="flex items-center gap-3 mb-8">
              <Database className="h-5 w-5 text-indigo-500" />
              <h3 className="text-neutral-500 text-sm font-medium">Last Sync</h3>
            </div>
            <span className="text-lg font-bold text-neutral-800 truncate">
              {new Date(data.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Live Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
          <div className="lg:col-span-2 bg-white p-24 rounded-xl shadow-card border border-neutral-100">
            <div className="flex justify-between items-center mb-24">
              <h3 className="font-semibold text-lg text-neutral-900">Temperature Trend (Last 30 Updates)</h3>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Live Data
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(str) => new Date(str).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 10]}
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTemp)"
                    animationDuration={500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions / Status */}
          <div className="bg-indigo-50 p-24 rounded-xl border border-indigo-100">
            <h3 className="font-semibold text-lg text-indigo-900 mb-16">System Status</h3>
            <div className="space-y-16">
              <div className="flex items-center gap-3 text-indigo-700">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Wifi className="h-4 w-4" />
                </div>
                <span className="font-medium">Gateway: Online</span>
              </div>
              <div className="flex items-center gap-3 text-indigo-700">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <BrainCircuit className="h-4 w-4" />
                </div>
                <span className="font-medium">AI Model: Active</span>
              </div>
              <div className="pt-16 border-t border-indigo-200">
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${isSimulating ? 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                  {isSimulating ? 'Pause Simulation' : 'Resume Simulation'}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
