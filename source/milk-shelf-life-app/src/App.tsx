import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Sensors from './pages/Sensors'
import Prediction from './pages/Prediction'
import QCCharts from './pages/QCCharts'
import Alerts from './pages/Alerts'
import Analytics from './pages/Analytics'
import AddProduct from './pages/AddProduct'
import Vision from './pages/Vision'
import DairyDoctor from './pages/DairyDoctor'
import './index.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sensors" element={<Sensors />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/qc-charts" element={<QCCharts />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/dairy-doctor" element={<DairyDoctor />} />
              <Route path="/vision" element={<Vision />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
