
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Calendar, TrendingUp, AlertTriangle, CheckCircle, X } from 'lucide-react'
import { supabase, EDGE_FUNCTIONS } from '@/lib/supabase'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { SafetyAnalysis } from '@/components/SafetyAnalysis'

interface Prediction {
  id: string
  batch_id: string
  predicted_shelf_life_hours: number
  confidence_lower: number
  confidence_upper: number
  accuracy_score: number
  risk_factors: string[]
  last_updated: string
}

export default function Prediction() {
  const location = useLocation()
  const navigate = useNavigate()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [latestPrediction, setLatestPrediction] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [latestReadings, setLatestReadings] = useState<any>(null)

  useEffect(() => {
    fetchPredictions()

    // Check if we're coming from Add Product page
    if (location.state?.success && location.state?.newBatch) {
      setShowSuccessNotification(true)
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setShowSuccessNotification(false)
      }, 5000)
    }
  }, [location.state])

  // Fetch readings when a prediction is loaded
  useEffect(() => {
    if (latestPrediction?.batch_id) {
      fetchLatestReadings(latestPrediction.batch_id)
    }
  }, [latestPrediction])

  const fetchLatestReadings = async (batchId: string) => {
    try {
      // 1. Get Sensor Types Map
      const { data: sensors } = await supabase.from('sensors').select('id, sensor_type')
      const sensorMap = new Map(sensors?.map(s => [s.id, s.sensor_type]))

      // 2. Get Readings for Batch
      const { data: readings } = await supabase
        .from('sensor_readings')
        .select('*')
        .eq('batch_id', batchId)
        .order('timestamp', { ascending: false })
        .limit(10) // Fetch enough to cover all types

      if (readings && readings.length > 0) {
        const processed: any = {}
        const latestTimestamp = readings[0].timestamp

        // Group by sensor type (only strictly latest ones)
        readings.forEach(r => {
          const type = sensorMap.get(r.sensor_id)
          if (type && !processed[type]) {
            processed[type] = r.value
          }
        })

        // Fallback for temperature if redundant column exists
        if (!processed['Temperature'] && readings[0].temperature_celsius) {
          processed['Temperature'] = readings[0].temperature_celsius
        }

        setLatestReadings({
          temperature: processed['Temperature'] || 4.2,
          ph: processed['pH'] || 6.7,
          bacteria: processed['Bacteria'] || 30000,
          humidity: processed['Humidity'] || 65,
          timestamp: latestTimestamp
        })
      }
    } catch (e) {
      console.error("Error fetching readings", e)
    }
  }

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('shelf_life_predictions')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(20)

      if (data && data.length > 0) {
        setPredictions(data)
        setLatestPrediction(data[0])
      } else {
        // Fallback Simulation
        const simPrediction = {
          id: 'sim-1',
          batch_id: 'BATCH-DEMO-2026',
          predicted_shelf_life_hours: 184, // ~7.6 days
          confidence_lower: 172,
          confidence_upper: 196,
          accuracy_score: 94.5,
          risk_factors: [],
          last_updated: new Date().toISOString()
        }
        setPredictions([simPrediction])
        setLatestPrediction(simPrediction)

        // Also set simulated readings if we are using simulated prediction
        setLatestReadings({
          temperature: 4.1,
          ph: 6.75,
          bacteria: 15000,
          humidity: 65,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error fetching predictions:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateNewPrediction = async () => {
    setGenerating(true)
    try {
      const currentReadings = latestReadings || { temperature: 4.5, ph: 6.8, bacteria: 30000 }

      // Call ML prediction edge function
      const response = await fetch(EDGE_FUNCTIONS.ML_PREDICTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          batchId: latestPrediction?.batch_id || 'BATCH-' + Date.now(),
          temperature: currentReadings.temperature,
          ph: currentReadings.ph,
          bacteriaCount: currentReadings.bacteria,
          humidity: currentReadings.humidity,
          fatContent: 3.5,
          storageDays: 0,
        }),
      })

      const result = await response.json()

      if (result.data) {
        // Save prediction to database
        const { error } = await supabase
          .from('shelf_life_predictions')
          .insert({
            batch_id: result.data.batchId,
            predicted_shelf_life_hours: result.data.predictedShelfLifeHours,
            confidence_lower: result.data.confidenceLower,
            confidence_upper: result.data.confidenceUpper,
            accuracy_score: result.data.accuracyScore,
            risk_factors: result.data.riskFactors,
          })

        if (!error) {
          await fetchPredictions()
        }
      }
    } catch (error) {
      console.error('Error generating prediction:', error)
    } finally {
      setGenerating(false)
    }
  }

  const getConfidenceData = () => {
    if (!latestPrediction) return []

    const predicted = latestPrediction.predicted_shelf_life_hours / 24
    const lower = latestPrediction.confidence_lower / 24
    const upper = latestPrediction.confidence_upper / 24

    return [
      { name: 'Lower Bound', value: lower },
      { name: 'Predicted', value: predicted },
      { name: 'Upper Bound', value: upper },
    ]
  }

  const getHistoryData = () => {
    return predictions.map(p => ({
      date: new Date(p.last_updated).toLocaleDateString(),
      predicted: p.predicted_shelf_life_hours / 24,
      lower: p.confidence_lower / 24,
      upper: p.confidence_upper / 24,
    }))
  }

  const RiskFactorCard = ({ factor }: { factor: string }) => (
    <div className="bg-warning-500/5 border-l-4 border-warning-500 rounded-lg p-24">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-warning-700 flex-shrink-0 mt-1" />
        <p className="text-body text-neutral-900">{factor}</p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const daysRemaining = latestPrediction ? latestPrediction.predicted_shelf_life_hours / 24 : 0
  const status = daysRemaining > 4 ? 'normal' : daysRemaining > 2 ? 'warning' : 'critical'

  return (
    <div>
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-24 right-8 z-50 animate-slideInRight">
          <div className="bg-white rounded-xl shadow-modal border border-success-200 p-6 flex items-start gap-4 max-w-md">
            <CheckCircle className="h-6 w-6 text-success-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-neutral-900 mb-1">Product Added Successfully!</h4>
              <p className="text-sm text-neutral-700">
                Batch <span className="font-medium">{location.state?.newBatch}</span> has been added with shelf life prediction and QC charts generated.
              </p>
            </div>
            <button
              onClick={() => setShowSuccessNotification(false)}
              className="text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <section className="bg-background-page py-64 px-32">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16">
            <p className="text-small text-neutral-500">Dashboard / Prediction</p>
          </div>
          <h1 className="text-title-large font-bold text-neutral-900 mb-24">
            Shelf Life Prediction & Risk Assessment
          </h1>
          <p className="text-body-large text-neutral-700 max-w-3xl">
            ML-powered prediction display with confidence intervals and risk assessment based on multi-factor analysis
          </p>
        </div>
      </section>

      {/* Simulation Disclaimer Banner */}
      <div className="bg-blue-50 border-y border-blue-200 px-32 py-12">
        <div className="container mx-auto max-w-7xl flex items-center justify-center gap-2">
          <span className="text-xl">ℹ️</span>
          <p className="text-sm font-medium text-blue-800">
            <strong>SIMULATED DATA MODE:</strong> The predictions and confidence intervals below are generated using synthetic data based on scientific principles (Arrhenius & Q10 models).
          </p>
        </div>
      </div>

      {/* Main Prediction Display */}
      <section className="py-64 px-32 bg-background-surface">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
            {/* Left Column - Main Prediction */}
            <div className="lg:col-span-7">
              {latestPrediction ? (
                <>
                  {/* Large Metric Card */}
                  <div className={`bg-white rounded-lg p-48 shadow-card mb-32 border-l-4 ${status === 'normal' ? 'border-success-500' :
                    status === 'warning' ? 'border-warning-500' :
                      'border-critical-500'
                    }`}>
                    <div className="flex items-start justify-between mb-24">
                      <div>
                        <p className="text-small text-neutral-700 mb-16">Predicted Shelf Life</p>
                        <div className="flex items-baseline gap-3">
                          <span className="text-hero font-bold text-neutral-900">
                            {latestPrediction.predicted_shelf_life_hours < 24
                              ? latestPrediction.predicted_shelf_life_hours.toFixed(1)
                              : (latestPrediction.predicted_shelf_life_hours / 24).toFixed(1)}
                          </span>
                          <span className="text-title text-neutral-700">
                            {latestPrediction.predicted_shelf_life_hours < 24 ? 'hours' : 'days'}
                          </span>
                        </div>
                      </div>
                      <Calendar className={`h-12 w-12 ${status === 'normal' ? 'text-success-500' :
                        status === 'warning' ? 'text-warning-500' :
                          'text-critical-500'
                        }`} />
                    </div>

                    <div className="grid grid-cols-2 gap-24 mb-24">
                      <div>
                        <p className="text-caption text-neutral-500 mb-8">Confidence Range</p>
                        <p className="text-body font-medium text-neutral-900">
                          {latestPrediction.predicted_shelf_life_hours < 24
                            ? `${latestPrediction.confidence_lower.toFixed(1)} - ${latestPrediction.confidence_upper.toFixed(1)} hours`
                            : `${(latestPrediction.confidence_lower / 24).toFixed(1)} - ${(latestPrediction.confidence_upper / 24).toFixed(1)} days`
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-caption text-neutral-500 mb-8">Batch ID</p>
                        <p className="text-body font-medium text-neutral-900">{latestPrediction.batch_id}</p>
                      </div>
                    </div>

                    <div className="pt-24 border-t border-neutral-200">
                      <p className="text-caption text-neutral-500 mb-8">Predicted at</p>
                      <p className="text-small text-neutral-700">
                        {new Date(latestPrediction.last_updated).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Risk Factors Panel */}
                  <div>
                    <h3 className="text-title font-semibold text-neutral-900 mb-24">Risk Factors</h3>
                    <div className="space-y-16">
                      {latestPrediction.risk_factors && latestPrediction.risk_factors.length > 0 ? (
                        latestPrediction.risk_factors.map((factor, idx) => (
                          <RiskFactorCard key={idx} factor={factor} />
                        ))
                      ) : (
                        <div className="bg-success-500/5 border-l-4 border-success-500 rounded-lg p-24">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-success-700 flex-shrink-0 mt-1" />
                            <p className="text-body text-neutral-900">No significant risk factors detected</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg p-48 shadow-card text-center">
                  <p className="text-body text-neutral-700 mb-24">No predictions available</p>
                  <button
                    onClick={generateNewPrediction}
                    disabled={generating}
                    className="bg-primary text-white px-24 py-12 rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50"
                  >
                    {generating ? 'Generating...' : 'Generate Prediction'}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5">
              {/* [NEW] Explainable AI & Safety Analysis Layer - Moved here for better layout */}
              {latestPrediction && (
                <div className="mb-32">
                  <SafetyAnalysis
                    data={{
                      ph: latestReadings?.ph ?? 6.7,
                      temperature: latestReadings?.temperature ?? 4.2,
                      bacteriaCount: latestReadings?.bacteria ?? 30000,
                      predictedShelfLifeHours: latestPrediction.predicted_shelf_life_hours,
                      lastUpdated: latestPrediction.last_updated
                    }}
                  />
                </div>
              )}

              {/* Model Performance */}
              <div className="bg-white rounded-lg p-32 shadow-card mb-32">
                <h3 className="text-title font-semibold text-neutral-900 mb-24">Model Performance</h3>
                <div className="space-y-24">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <p className="text-small text-neutral-700">Accuracy Score</p>
                      <p className="text-body font-semibold text-neutral-900">
                        {latestPrediction?.accuracy_score || 92}%
                      </p>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-success-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${latestPrediction?.accuracy_score || 92}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <p className="text-small text-neutral-700">Confidence Coverage</p>
                      <p className="text-body font-semibold text-neutral-900">95%</p>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <p className="text-small text-neutral-700">Model Version</p>
                      <p className="text-body font-semibold text-neutral-900">v1.0</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confidence Visualization */}
              <div className="bg-white rounded-lg p-32 shadow-card">
                <h3 className="text-title font-semibold text-neutral-900 mb-24">Confidence Intervals</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={getConfidenceData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                    <XAxis
                      dataKey="name"
                      stroke="#A3A3A3"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="#A3A3A3"
                      style={{ fontSize: '12px' }}
                      label={{ value: 'Days', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E5E5',
                        borderRadius: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#0066FF"
                      fill="#0066FF"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <button
                onClick={generateNewPrediction}
                disabled={generating}
                className="w-full mt-32 bg-primary text-white px-24 py-12 rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 font-medium"
              >
                {generating ? 'Generating New Prediction...' : 'Generate New Prediction'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Prediction History Timeline */}
      <section className="py-64 px-32 bg-background-page">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-title font-semibold text-neutral-900 mb-48">Prediction History</h2>
          <div className="bg-white rounded-lg p-48 shadow-card">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={getHistoryData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="date"
                  stroke="#A3A3A3"
                  style={{ fontSize: '14px' }}
                />
                <YAxis
                  stroke="#A3A3A3"
                  style={{ fontSize: '14px' }}
                  label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="upper"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Upper Bound"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#0066FF"
                  strokeWidth={3}
                  name="Predicted"
                  dot={{ fill: '#0066FF', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="lower"
                  stroke="#EF4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Lower Bound"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  )
}
