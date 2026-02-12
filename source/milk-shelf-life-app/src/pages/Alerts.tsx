import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Alert {
  id: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  alert_type: string
  sensor_id: string
  threshold_value: number
  actual_value: number
  status: string
  triggered_at: string
  resolved_at: string | null
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()

    // Subscribe to real-time alerts
    const channel = supabase
      .channel('alerts-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'alerts'
      }, () => {
        fetchAlerts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [filter])

  const fetchAlerts = async () => {
    try {
      let query = supabase
        .from('alerts')
        .select('*')
        .order('triggered_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('severity', filter)
      }

      const { data, error } = await query

      if (error) throw error

      if (data && data.length > 0) {
        setAlerts(data)
      } else {
        // Fallback Simulation for Demo
        setAlerts([
          {
            id: 'sim-1',
            severity: 'critical',
            message: 'Temperature threshold exceeded in Storage Unit A',
            alert_type: 'Threshold Violation',
            sensor_id: 'TEMP-001',
            threshold_value: 5.0,
            actual_value: 6.2,
            status: 'active',
            triggered_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
            resolved_at: null
          },
          {
            id: 'sim-2',
            severity: 'warning',
            message: 'Bacterial growth rate variance detected',
            alert_type: 'Quality Risk',
            sensor_id: 'BACT-AI-01',
            threshold_value: 50000,
            actual_value: 45000,
            status: 'active',
            triggered_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            resolved_at: null
          },
          {
            id: 'sim-3',
            severity: 'info',
            message: 'Routine sensor calibration scheduled',
            alert_type: 'System Maintenance',
            sensor_id: 'SYS-MAINT',
            threshold_value: 0,
            actual_value: 0,
            status: 'active',
            triggered_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
            resolved_at: null
          },
          {
            id: 'sim-4',
            severity: 'warning',
            message: 'Humidity deviation detected',
            alert_type: 'Environment',
            sensor_id: 'HUM-002',
            threshold_value: 65,
            actual_value: 72,
            status: 'resolved',
            triggered_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            resolved_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString()
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
      // If error (e.g. table doesn't exist), also fall back to simulation
      setAlerts([
        {
          id: 'sim-err-1',
          severity: 'info',
          message: 'Demo Mode: Simulating alerts (Connection issue detected)',
          alert_type: 'System Info',
          sensor_id: 'DEMO-MODE',
          threshold_value: 0,
          actual_value: 0,
          status: 'active',
          triggered_at: new Date().toISOString(),
          resolved_at: null
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId)

      if (!error) {
        await fetchAlerts()
      }
    } catch (error) {
      console.error('Error resolving alert:', error)
    }
  }

  const AlertCard = ({ alert }: { alert: Alert }) => {
    const severityConfig = {
      critical: {
        icon: AlertTriangle,
        borderColor: 'border-critical-500',
        bgColor: 'bg-critical-500/5',
        textColor: 'text-critical-700',
        iconColor: 'text-critical-500',
        label: 'Critical',
      },
      warning: {
        icon: AlertTriangle,
        borderColor: 'border-warning-500',
        bgColor: 'bg-warning-500/5',
        textColor: 'text-warning-700',
        iconColor: 'text-warning-500',
        label: 'Warning',
      },
      info: {
        icon: Info,
        borderColor: 'border-primary-500',
        bgColor: 'bg-primary-500/5',
        textColor: 'text-primary-600',
        iconColor: 'text-primary-500',
        label: 'Info',
      },
    }

    const config = severityConfig[alert.severity]
    const Icon = config.icon

    return (
      <div className={`border-l-4 ${config.borderColor} ${config.bgColor} rounded-lg p-32 animate-slideIn ${alert.status === 'resolved' ? 'opacity-50' : ''
        }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-16">
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
              <span className={`text-title font-semibold ${config.textColor}`}>
                {config.label}
              </span>
              {alert.status === 'resolved' && (
                <span className="inline-flex items-center gap-1 px-12 py-4 bg-success-500/10 text-success-700 rounded-full text-caption font-medium">
                  <CheckCircle className="h-3 w-3" />
                  Resolved
                </span>
              )}
            </div>

            <p className="text-body text-neutral-900 mb-16">{alert.message}</p>

            <div className="grid grid-cols-2 gap-16 mb-16">
              <div>
                <p className="text-caption text-neutral-500 mb-4">Alert Type</p>
                <p className="text-small font-medium text-neutral-900">{alert.alert_type}</p>
              </div>
              <div>
                <p className="text-caption text-neutral-500 mb-4">Sensor ID</p>
                <p className="text-small font-medium text-neutral-900">{alert.sensor_id}</p>
              </div>
              <div>
                <p className="text-caption text-neutral-500 mb-4">Threshold Value</p>
                <p className="text-small font-medium text-neutral-900">{alert.threshold_value}</p>
              </div>
              <div>
                <p className="text-caption text-neutral-500 mb-4">Actual Value</p>
                <p className={`text-small font-medium ${alert.severity === 'critical' ? 'text-critical-700' :
                  alert.severity === 'warning' ? 'text-warning-700' :
                    'text-neutral-900'
                  }`}>
                  {alert.actual_value}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-caption text-neutral-500">
              <span>Triggered: {new Date(alert.triggered_at).toLocaleString()}</span>
              {alert.resolved_at && (
                <span>• Resolved: {new Date(alert.resolved_at).toLocaleString()}</span>
              )}
            </div>
          </div>

          <div className="ml-4 flex flex-col gap-2">
            {alert.status !== 'resolved' && (
              <button
                onClick={() => resolveAlert(alert.id)}
                className="px-16 py-8 bg-success-500 text-white rounded-md hover:bg-success-600 transition-colors text-small font-medium"
              >
                Resolve
              </button>
            )}
            <button className="px-16 py-8 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 transition-colors text-small font-medium">
              View Details
            </button>
          </div>
        </div>
      </div>
    )
  }

  const activeAlerts = alerts.filter(a => a.status !== 'resolved')
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved')
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length
  const warningCount = activeAlerts.filter(a => a.severity === 'warning').length
  const infoCount = activeAlerts.filter(a => a.severity === 'info').length

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
            <p className="text-small text-neutral-500">Dashboard / Alerts</p>
          </div>
          <h1 className="text-title-large font-bold text-neutral-900 mb-24">
            Alert Center
          </h1>
          <p className="text-body-large text-neutral-700 max-w-3xl">
            Notification system for quality threshold breaches and equipment issues with real-time monitoring
          </p>
        </div>
      </section>

      {/* Alert Statistics */}
      <section className="py-64 px-32 bg-background-surface">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-48">
            <div className="bg-white rounded-lg p-32 shadow-card">
              <p className="text-small text-neutral-700 mb-8">Total Active</p>
              <p className="text-title-large font-bold text-neutral-900">{activeAlerts.length}</p>
            </div>
            <div className="bg-critical-500/5 border-l-4 border-critical-500 rounded-lg p-32 shadow-card">
              <p className="text-small text-critical-700 mb-8">Critical</p>
              <p className="text-title-large font-bold text-critical-700">{criticalCount}</p>
            </div>
            <div className="bg-warning-500/5 border-l-4 border-warning-500 rounded-lg p-32 shadow-card">
              <p className="text-small text-warning-700 mb-8">Warning</p>
              <p className="text-title-large font-bold text-warning-700">{warningCount}</p>
            </div>
            <div className="bg-primary-500/5 border-l-4 border-primary-500 rounded-lg p-32 shadow-card">
              <p className="text-small text-primary-600 mb-8">Info</p>
              <p className="text-title-large font-bold text-primary-600">{infoCount}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-8 mb-32">
            {(['all', 'critical', 'warning', 'info'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-24 py-12 text-body font-medium transition-all duration-base rounded-md ${filter === filterType
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          {/* Active Alerts */}
          <div className="mb-64">
            <h2 className="text-title font-semibold text-neutral-900 mb-24">Active Alerts</h2>
            <div className="space-y-16">
              {activeAlerts.length > 0 ? (
                activeAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              ) : (
                <div className="bg-success-500/5 border-l-4 border-success-500 rounded-lg p-48 text-center">
                  <CheckCircle className="h-12 w-12 text-success-500 mx-auto mb-16" />
                  <p className="text-body text-neutral-900 font-medium mb-8">No active alerts</p>
                  <p className="text-small text-neutral-700">All systems are operating within normal parameters</p>
                </div>
              )}
            </div>
          </div>

          {/* Resolved Alerts */}
          {resolvedAlerts.length > 0 && (
            <div>
              <h2 className="text-title font-semibold text-neutral-900 mb-24">Resolved Alerts</h2>
              <div className="space-y-16 max-h-[600px] overflow-y-auto">
                {resolvedAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
