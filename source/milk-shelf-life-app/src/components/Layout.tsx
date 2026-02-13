import { Link, useLocation, Outlet } from 'react-router-dom'
import { Bell, Activity, Plus, LogOut, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export default function Layout() {
  const { signOut } = useAuth()
  const location = useLocation()
  const [alertCount, setAlertCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Fetch active alerts count
    const fetchAlerts = async () => {
      const { data } = await supabase
        .from('alerts')
        .select('id', { count: 'exact' })
        .neq('status', 'resolved')

      setAlertCount(data?.length || 0)
    }

    fetchAlerts()

    // Subscribe to alerts
    const channel = supabase
      .channel('alerts-count')
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
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/sensors', label: 'Sensors' },
    { path: '/prediction', label: 'Prediction' },
    { path: '/qc-charts', label: 'QC Charts' },
    { path: '/alerts', label: 'Alerts' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/dairy-doctor', label: 'Dairy Doctor' },
    { path: '/vision', label: 'Vision' },
  ]

  return (
    <div className="min-h-screen bg-background-page">
      {/* Navigation Bar */}
      <nav
        className={`sticky top-0 z-50 bg-white transition-shadow duration-base ${scrolled ? 'shadow-card' : ''
          }`}
        style={{ height: '72px' }}
      >
        <div className="container mx-auto h-full flex items-center px-32">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-48">
            <Activity className="h-10 w-10 text-primary" />
            <span className="text-title font-semibold text-neutral-900">DairyGuard</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-32">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-body font-medium transition-colors duration-base relative pb-1 ${location.pathname === link.path
                  ? 'text-primary'
                  : 'text-neutral-700 hover:text-neutral-900'
                  }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="ml-auto flex items-center gap-16">
            {/* Add Product Button */}
            <Link
              to="/add-product"
              className="flex items-center gap-2 h-10 px-4 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm">Add Product</span>
            </Link>

            {/* Alert Badge */}
            <Link to="/alerts" className="relative">
              <Bell className="h-6 w-6 text-neutral-700 hover:text-neutral-900 transition-colors" />
              {alertCount > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-critical-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-medium">{alertCount}</span>
                </div>
              )}
            </Link>

            {/* User Menu */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center outline-none focus:ring-2 focus:ring-primary-500 hover:bg-primary-200 transition-colors">
                  <span className="text-primary-600 text-sm font-medium">DM</span>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[200px] bg-white rounded-lg p-1.5 shadow-lg border border-neutral-200 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 z-50 mr-4"
                  sideOffset={5}
                  align="end"
                >
                  <div className="px-2 py-1.5 text-sm font-medium text-neutral-900 border-b border-neutral-100 mb-1">
                    My Account
                  </div>
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-2 py-1.5 text-sm text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-md cursor-pointer outline-none transition-colors"
                    onClick={() => {
                      // Navigate to profile or settings if implemented
                    }}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-2 py-1.5 text-sm text-critical-600 hover:text-critical-700 hover:bg-critical-50 rounded-md cursor-pointer outline-none transition-colors mt-1"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="animate-pageEnter">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-neutral-100 border-t border-neutral-200" style={{ height: '120px' }}>
        <div className="container mx-auto h-full flex items-center justify-between px-32">
          <p className="text-small text-neutral-700">
            © 2025 DairyGuard IoT Monitoring System
          </p>
          <p className="text-small text-neutral-500">
            Real-time dairy quality control & shelf life prediction
          </p>
        </div>
      </footer>
    </div>
  )
}
