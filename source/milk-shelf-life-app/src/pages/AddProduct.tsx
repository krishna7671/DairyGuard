import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Package, Calendar, Droplet, Thermometer, Wind } from 'lucide-react'

interface FormData {
  milkType: string
  productionDate: string
  initialQualityScore: number
  temperature: string
  phLevel: string
  humidity: string
}

interface SensorIDs {
  temperature: string | null
  ph: string | null
  bacteria: string | null
  humidity: string | null
}

export default function AddProduct() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    milkType: 'Whole Milk',
    productionDate: new Date().toISOString().split('T')[0],
    initialQualityScore: 95,
    temperature: '',
    phLevel: '',
    humidity: ''
  })

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateBatchId = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `BATCH-${timestamp}${random}`
  }

  const calculateInitialBacteria = (score: number): number => {
    // 100 -> 5,000 CFU/ml (High quality)
    // 90 -> 15,000 CFU/ml
    // 80 -> 50,000 CFU/ml
    // 70 -> 100,000 CFU/ml
    // 60 -> 500,000 CFU/ml (Poor quality)
    if (score >= 95) return 5000 + Math.random() * 2000
    if (score >= 90) return 15000 + Math.random() * 5000
    if (score >= 80) return 50000 + Math.random() * 10000
    if (score >= 70) return 100000 + Math.random() * 20000
    return 500000 + Math.random() * 100000
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Generate unique batch ID
      const batchId = generateBatchId()

      // Calculate expiration date (5 days from production for initial estimate)
      const productionDate = new Date(formData.productionDate)
      const expirationDate = new Date(productionDate)
      expirationDate.setDate(expirationDate.getDate() + 5)

      // Map milk type to fat content
      const fatContentMap: { [key: string]: number } = {
        'Whole Milk': 3.5,
        '2% Milk': 2.0,
        'Fat-Free Milk': 0.1
      }

      // Calculate initial estimated bacteria count
      const estimatedBacteria = calculateInitialBacteria(formData.initialQualityScore)

      // Insert milk batch
      const { data: batchData, error: batchError } = await supabase
        .from('milk_batches')
        .insert({
          batch_id: batchId,
          milk_type: formData.milkType,
          fat_content: fatContentMap[formData.milkType],
          protein_content: 3.2,
          ph_level: formData.phLevel ? parseFloat(formData.phLevel) : null,
          production_date: productionDate.toISOString(),
          expiration_date: expirationDate.toISOString(),
          processing_temp: 72.0, // Standard pasteurization temp
          storage_temp: formData.temperature ? parseFloat(formData.temperature) : null,
          status: 'active'
        })
        .select()
        .single()

      if (batchError) throw batchError

      // Get sensor IDs for creating sensor readings
      const { data: sensors } = await supabase
        .from('sensors')
        .select('id, sensor_type')

      // Robust case-insensitive lookup
      const findSensorId = (type: string) => {
        return sensors?.find(s => s.sensor_type.toLowerCase() === type.toLowerCase())?.id || null;
      };

      const sensorIds: SensorIDs = {
        temperature: findSensorId('Temperature'),
        ph: findSensorId('pH'),
        bacteria: findSensorId('Bacteria'),
        humidity: findSensorId('Humidity')
      }

      // Insert sensor readings if provided
      const sensorReadings = []

      if (formData.temperature && sensorIds.temperature) {
        sensorReadings.push({
          sensor_id: sensorIds.temperature,
          value: parseFloat(formData.temperature),
          unit: '°C',
          quality_flag: parseFloat(formData.temperature) <= 6 ? 'normal' : 'warning',
          temperature_celsius: parseFloat(formData.temperature),
          humidity_percent: formData.humidity ? parseFloat(formData.humidity) : null,
          batch_id: batchId,
          milk_type: formData.milkType
        })
      }

      if (formData.phLevel && sensorIds.ph) {
        sensorReadings.push({
          sensor_id: sensorIds.ph,
          value: parseFloat(formData.phLevel),
          unit: 'pH',
          quality_flag: parseFloat(formData.phLevel) >= 6.7 ? 'normal' : 'warning',
          temperature_celsius: formData.temperature ? parseFloat(formData.temperature) : null,
          humidity_percent: formData.humidity ? parseFloat(formData.humidity) : null,
          batch_id: batchId,
          milk_type: formData.milkType
        })
      }

      // Insert ESTIMATED bacteria as a sensor reading
      if (sensorIds.bacteria) {
        sensorReadings.push({
          sensor_id: sensorIds.bacteria,
          value: estimatedBacteria,
          unit: 'CFU/ml',
          quality_flag: estimatedBacteria <= 100000 ? 'normal' : 'warning',
          temperature_celsius: formData.temperature ? parseFloat(formData.temperature) : null,
          humidity_percent: formData.humidity ? parseFloat(formData.humidity) : null,
          batch_id: batchId,
          milk_type: formData.milkType
        })
      }

      if (formData.humidity && sensorIds.humidity) {
        sensorReadings.push({
          sensor_id: sensorIds.humidity,
          value: parseFloat(formData.humidity),
          unit: '%',
          quality_flag: parseFloat(formData.humidity) <= 70 ? 'normal' : 'warning',
          temperature_celsius: formData.temperature ? parseFloat(formData.temperature) : null,
          humidity_percent: parseFloat(formData.humidity),
          batch_id: batchId,
          milk_type: formData.milkType
        })
      }

      if (sensorReadings.length > 0) {
        const { error: sensorError } = await supabase
          .from('sensor_readings')
          .insert(sensorReadings)

        if (sensorError) throw sensorError
      }

      // Call ML Prediction Edge Function
      const predictionResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ml_prediction`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            batchId: batchId,
            temperature: formData.temperature ? parseFloat(formData.temperature) : 4.0,
            ph: formData.phLevel ? parseFloat(formData.phLevel) : 6.8,
            bacteriaCount: estimatedBacteria, // Use estimated value
            humidity: formData.humidity ? parseFloat(formData.humidity) : 65,
            fatContent: fatContentMap[formData.milkType],
            storageDays: 0
          })
        }
      )

      if (!predictionResponse.ok) {
        throw new Error('Failed to generate shelf life prediction')
      }

      const predictionResult = await predictionResponse.json()
      const prediction = predictionResult.data

      // Insert shelf life prediction
      const { error: predictionError } = await supabase
        .from('shelf_life_predictions')
        .insert({
          batch_id: batchId, // Use the string ID (BATCH-XXX), not the UUID (batchData.id)
          predicted_shelf_life_hours: prediction.predictedShelfLifeHours,
          confidence_lower: prediction.confidenceLower,
          confidence_upper: prediction.confidenceUpper,
          prediction_method: prediction.predictionMethod,
          accuracy_score: prediction.accuracyScore,
          risk_factors: prediction.riskFactors
        })

      if (predictionError) throw predictionError

      // Generate QC charts for the new batch
      const chartTypes = ['xbar_control', 'r_control', 'histogram', 'scatter']

      for (const chartType of chartTypes) {
        const qcResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/qc_charts_generator`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
              chartType: chartType,
              batchIds: [batchId],
              timePeriodHours: 24
            })
          }
        )

        if (qcResponse.ok) {
          const qcResult = await qcResponse.json()

          await supabase
            .from('qc_charts_data')
            .insert({
              chart_type: chartType,
              data_points: qcResult.data.data,
              control_limits: qcResult.data.data.length > 0 && qcResult.data.data[0].ucl
                ? { ucl: qcResult.data.data[0].ucl, lcl: qcResult.data.data[0].lcl || 0 }
                : null,
              parameters: qcResult.data.parameters,
              time_period_hours: 24,
              batch_filter: [batchId]
            })
        }
      }

      // Success! Navigate to prediction page with success message
      navigate('/prediction', {
        state: {
          newBatch: batchId,
          prediction: prediction,
          success: true
        }
      })

    } catch (err) {
      console.error('Error adding product:', err)
      setError(err instanceof Error ? err.message : 'Failed to add product')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-8 h-8 text-primary-500" />
            <h1 className="text-4xl font-bold text-neutral-900">Add New Product</h1>
          </div>
          <p className="text-lg text-neutral-700">
            Add a new milk batch to the system and generate instant shelf life predictions
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-critical-50 border border-critical-200 rounded-lg">
            <p className="text-critical-700 font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Basic Information</h2>

            {/* Milk Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Milk Type *
              </label>
              <select
                required
                value={formData.milkType}
                onChange={(e) => handleInputChange('milkType', e.target.value)}
                className="w-full h-12 px-4 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="Whole Milk">Whole Milk</option>
                <option value="2% Milk">2% Milk</option>
                <option value="Fat-Free Milk">Fat-Free Milk</option>
              </select>
            </div>

            {/* Production Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Production Date *
                </div>
              </label>
              <input
                type="date"
                required
                value={formData.productionDate}
                onChange={(e) => handleInputChange('productionDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full h-12 px-4 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Initial Quality Score */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Initial Quality Score (0-100) *
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.initialQualityScore}
                onChange={(e) => handleInputChange('initialQualityScore', parseInt(e.target.value))}
                className="w-full h-12 px-4 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <div className="mt-2 flex justify-between text-xs text-neutral-500">
                <span>Poor: 0-60</span>
                <span>Good: 61-85</span>
                <span>Excellent: 86-100</span>
              </div>
            </div>
          </div>

          {/* Sensor Readings Section */}
          <div className="mb-8 pt-8 border-t border-neutral-200">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Sensor Readings</h2>
            <p className="text-neutral-600 mb-6 text-sm">
              Optional: Provide sensor readings for more accurate predictions
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    Temperature (°C)
                  </div>
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 4.0"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  className="w-full h-12 px-4 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <p className="mt-1 text-xs text-neutral-500">Optimal: 2-6°C</p>
              </div>

              {/* pH Level */}
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4" />
                    pH Level
                  </div>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 6.8"
                  value={formData.phLevel}
                  onChange={(e) => handleInputChange('phLevel', e.target.value)}
                  className="w-full h-12 px-4 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <p className="mt-1 text-xs text-neutral-500">Normal: 6.7-6.9</p>
              </div>

              {/* Humidity */}
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4" />
                    Humidity (%)
                  </div>
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 65"
                  value={formData.humidity}
                  onChange={(e) => handleInputChange('humidity', e.target.value)}
                  className="w-full h-12 px-4 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <p className="mt-1 text-xs text-neutral-500">Optimal: 60-70%</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <span>ℹ️</span>
                <b>Note</b>: Bacterial count is now AI-Estimated based on Initial Quality Score and storage conditions. Manual input is no longer required.
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="flex-1 h-12 px-6 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 px-6 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Package className="w-5 h-5" />
                  Add Product & Generate Predictions
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-6 bg-primary-50 border border-primary-200 rounded-xl">
          <h3 className="font-semibold text-primary-900 mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm text-primary-800">
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">•</span>
              <span>Your product will be added to the inventory with a unique batch ID</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">•</span>
              <span>ML model will generate shelf life prediction based on provided parameters</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">•</span>
              <span>Quality control charts will be automatically created for monitoring</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">•</span>
              <span>You'll be redirected to view the prediction results and details</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
