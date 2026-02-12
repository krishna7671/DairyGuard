import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Thermometer, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Droplets,
  BarChart3,
  LineChart,
  Calendar
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface MetricData {
  sensorCount: number
  avgPrediction: number
  activeAlerts: number
  qualityScore: number
}

interface Alert {
  id: string
  severity: string
  message: string
  alert_type: string
  triggered_at: string
  status: string
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<MetricData>({
    sensorCount: 0,
    avgPrediction: 0,
    activeAlerts: 0,
    qualityScore: 0,
  })
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'alerts' 
      }, () => {
        fetchDashboardData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch sensor count
      const { count: sensorCount } = await supabase
        .from('sensors')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // Fetch average shelf life prediction
      const { data: predictions } = await supabase
        .from('shelf_life_predictions')
        .select('predicted_shelf_life_hours')
        .order('last_updated', { ascending: false })
        .limit(10)

      const avgPrediction = predictions && predictions.length > 0
        ? predictions.reduce((sum, p) => sum + (p.predicted_shelf_life_hours || 0), 0) / predictions.length / 24
        : 0

      // Fetch active alerts
      const { data: alertsData, count: alertCount } = await supabase
        .from('alerts')
        .select('*', { count: 'exact' })
        .neq('status', 'resolved')
        .order('triggered_at', { ascending: false })
        .limit(5)

      // Calculate quality score (simplified)
      const qualityScore = 100 - (alertCount || 0) * 5

      setMetrics({
        sensorCount: sensorCount || 0,
        avgPrediction: Math.round(avgPrediction * 10) / 10,
        activeAlerts: alertCount || 0,
        qualityScore: Math.max(qualityScore, 0),
      })

      setAlerts(alertsData || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const MetricCard = ({ 
    icon: Icon, 
    label, 
    value, 
    unit, 
    trend, 
    status 
  }: {
    icon: any
    label: string
    value: number | string
    unit?: string
    trend?: { value: number; isPositive: boolean }
    status: 'normal' | 'warning' | 'critical'
  }) => {
    const statusColors = {
      normal: 'border-success-500',
      warning: 'border-warning-500',
      critical: 'border-critical-500',
    }

    const iconColors = {
      normal: 'text-success-500',
      warning: 'text-warning-500',
      critical: 'text-critical-500',
    }

    return (
      <div className={`bg-background-surface rounded-lg p-48 shadow-card hover:shadow-card-hover transition-all duration-base hover:-translate-y-1 border-l-4 ${statusColors[status]}`}>
        <Icon className={`h-8 w-8 mb-16 ${iconColors[status]}`} />
        <p className="text-small text-neutral-700 mb-8">{label}</p>
        <div className="flex items-baseline gap-2 mb-8">
          <span className="text-title-large font-bold text-neutral-900">{value}</span>
          {unit && <span className="text-body text-neutral-700">{unit}</span>}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-small ${trend.isPositive ? 'text-success-700' : 'text-critical-700'}`}>
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    )
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
      {/* Hero Overview Panel */}
      <section className="bg-background-page py-64 px-32">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-hero font-bold text-neutral-900 text-center mb-24">
            Milk Shelf Life Monitoring System
          </h1>
          <p className="text-body-large text-neutral-700 text-center max-w-3xl mx-auto mb-48">
            Real-time monitoring and prediction system for dairy quality control with IoT sensors and machine learning
          </p>

          {/* System Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            <div className="bg-white rounded-lg p-32 text-center shadow-card">
              <Thermometer className="h-10 w-10 text-primary mx-auto mb-16" />
              <p className="text-small text-neutral-700 mb-8">Temperature Sensors</p>
              <p className="text-title font-semibold text-neutral-900">±0.5°C Accuracy</p>
            </div>
            <div className="bg-white rounded-lg p-32 text-center shadow-card">
              <Droplets className="h-10 w-10 text-primary mx-auto mb-16" />
              <p className="text-small text-neutral-700 mb-8">pH Monitoring</p>
              <p className="text-title font-semibold text-neutral-900">±0.1 pH Range</p>
            </div>
            <div className="bg-white rounded-lg p-32 text-center shadow-card">
              <Activity className="h-10 w-10 text-primary mx-auto mb-16" />
              <p className="text-small text-neutral-700 mb-8">Bacteria Detection</p>
              <p className="text-title font-semibold text-neutral-900">11h Detection Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Grid */}
      <section className="py-64 px-32 bg-background-page">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-title-large font-bold text-neutral-900 mb-48">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
            <MetricCard
              icon={Activity}
              label="Active Sensors"
              value={metrics.sensorCount}
              status="normal"
              trend={{ value: 2.3, isPositive: true }}
            />
            <MetricCard
              icon={Calendar}
              label="Avg Shelf Life"
              value={metrics.avgPrediction}
              unit="days"
              status="normal"
              trend={{ value: 1.5, isPositive: true }}
            />
            <MetricCard
              icon={AlertTriangle}
              label="Active Alerts"
              value={metrics.activeAlerts}
              status={metrics.activeAlerts > 5 ? 'critical' : metrics.activeAlerts > 2 ? 'warning' : 'normal'}
            />
            <MetricCard
              icon={CheckCircle}
              label="Quality Score"
              value={metrics.qualityScore}
              unit="%"
              status={metrics.qualityScore < 70 ? 'critical' : metrics.qualityScore < 85 ? 'warning' : 'normal'}
            />
          </div>
        </div>
      </section>

      {/* Recent Alerts Feed */}
      <section className="py-64 px-32 bg-background-surface">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-title-large font-bold text-neutral-900 mb-48">Recent Alerts</h2>
          <div className="space-y-16 max-h-[400px] overflow-y-auto">
            {alerts.length > 0 ? (
              alerts.map((alert) => {
                const severityConfig = {
                  critical: {
                    borderColor: 'border-critical-500',
                    bgColor: 'bg-critical-500/5',
                    textColor: 'text-critical-700',
                  },
                  warning: {
                    borderColor: 'border-warning-500',
                    bgColor: 'bg-warning-500/5',
                    textColor: 'text-warning-700',
                  },
                  info: {
                    borderColor: 'border-primary-500',
                    bgColor: 'bg-primary-500/5',
                    textColor: 'text-primary-600',
                  },
                }

                const config = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.info

                return (
                  <div
                    key={alert.id}
                    className={`border-l-4 ${config.borderColor} ${config.bgColor} rounded-lg p-32 animate-slideIn`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-16">
                          <AlertTriangle className={`h-6 w-6 ${config.textColor}`} />
                          <span className={`text-title font-semibold ${config.textColor}`}>
                            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                          </span>
                        </div>
                        <p className="text-body text-neutral-900 mb-8">{alert.message}</p>
                        <p className="text-small text-neutral-700">Type: {alert.alert_type}</p>
                      </div>
                      <p className="text-caption text-neutral-500 whitespace-nowrap ml-4">
                        {new Date(alert.triggered_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-body text-neutral-500 text-center py-32">No active alerts</p>
            )}
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="py-96 px-32 bg-background-page">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-title-large font-bold text-neutral-900 mb-48">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
            <Link to="/sensors" className="group">
              <div className="bg-white rounded-lg p-48 shadow-card hover:shadow-card-hover transition-all duration-base hover:-translate-y-1">
                <Activity className="h-12 w-12 text-primary mb-24 group-hover:scale-110 transition-transform" />
                <h3 className="text-title font-semibold text-neutral-900 mb-16">Real-Time Sensors</h3>
                <p className="text-body text-neutral-700">Monitor live IoT sensor data with connectivity status</p>
              </div>
            </Link>

            <Link to="/prediction" className="group">
              <div className="bg-white rounded-lg p-48 shadow-card hover:shadow-card-hover transition-all duration-base hover:-translate-y-1">
                <LineChart className="h-12 w-12 text-primary mb-24 group-hover:scale-110 transition-transform" />
                <h3 className="text-title font-semibold text-neutral-900 mb-16">Shelf Life Prediction</h3>
                <p className="text-body text-neutral-700">ML-powered predictions with confidence intervals</p>
              </div>
            </Link>

            <Link to="/qc-charts" className="group">
              <div className="bg-white rounded-lg p-48 shadow-card hover:shadow-card-hover transition-all duration-base hover:-translate-y-1">
                <BarChart3 className="h-12 w-12 text-primary mb-24 group-hover:scale-110 transition-transform" />
                <h3 className="text-title font-semibold text-neutral-900 mb-16">Quality Control Charts</h3>
                <p className="text-body text-neutral-700">7 interactive QC charts for process control</p>
              </div>
            </Link>

            <Link to="/alerts" className="group">
              <div className="bg-white rounded-lg p-48 shadow-card hover:shadow-card-hover transition-all duration-base hover:-translate-y-1">
                <AlertTriangle className="h-12 w-12 text-primary mb-24 group-hover:scale-110 transition-transform" />
                <h3 className="text-title font-semibold text-neutral-900 mb-16">Alert Center</h3>
                <p className="text-body text-neutral-700">Manage quality threshold breaches and alerts</p>
              </div>
            </Link>

            <Link to="/analytics" className="group">
              <div className="bg-white rounded-lg p-48 shadow-card hover:shadow-card-hover transition-all duration-base hover:-translate-y-1">
                <TrendingUp className="h-12 w-12 text-primary mb-24 group-hover:scale-110 transition-transform" />
                <h3 className="text-title font-semibold text-neutral-900 mb-16">Historical Analytics</h3>
                <p className="text-body text-neutral-700">Trend analysis and performance metrics</p>
              </div>
            </Link>

            <div className="bg-neutral-100 rounded-lg p-48 shadow-card border-2 border-dashed border-neutral-200">
              <div className="h-12 w-12 bg-neutral-200 rounded-lg mb-24"></div>
              <h3 className="text-title font-semibold text-neutral-500 mb-16">Settings</h3>
              <p className="text-body text-neutral-500">System configuration (Coming soon)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
