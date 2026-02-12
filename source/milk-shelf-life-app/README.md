# 🥛 Milk Shelf Life Monitoring System

A comprehensive IoT-powered web application for predicting milk shelf life using machine learning and monitoring quality through real-time sensors and quality control charts.

![Status](https://img.shields.io/badge/status-production-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

## 🌟 Features

### Real-Time IoT Monitoring
- Live sensor data tracking (temperature, pH, bacteria count, humidity)
- Automated quality flag detection and alerts
- Connection status monitoring with real-time updates
- Sensor specification management and calibration tracking

### ML-Powered Shelf Life Prediction
- Multi-factor prediction algorithm considering:
  - Storage temperature and temperature abuse detection
  - pH levels and acidification monitoring
  - Bacterial contamination levels
  - Fat content and milk type (whole, 2%, fat-free)
- Confidence interval calculations (±20% range)
- Risk factor assessment and early warning system
- Accuracy scores based on data quality

### 7 Quality Control Charts
1. **Pareto Chart** - Defect prioritization (80/20 rule)
2. **X-bar Control Chart** - Process mean monitoring
3. **R Control Chart** - Process variability tracking
4. **Fishbone Diagram** - Root cause analysis (6M categories)
5. **Histogram** - Distribution visualization with statistics
6. **Scatter Plot** - Correlation analysis with regression
7. **P-Chart** - Proportion defective monitoring
8. **C-Chart** - Defects per unit tracking

### Additional Features
- Alert system with severity levels (Critical, Warning, Info)
- Historical analytics and trend analysis
- Batch comparison and performance metrics
- PDF/CSV export capabilities
- Mobile-responsive design for field monitoring
- WCAG AA accessibility compliance

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Chart.js for interactive visualizations
- **Build**: Vite for fast development and optimized builds
- **Real-time**: Supabase WebSocket subscriptions

### Backend
- **Database**: Supabase PostgreSQL (8 tables)
- **Edge Functions**: 3 serverless functions for ML and data processing
- **Storage**: 50MB bucket for reports and exports
- **Authentication**: Supabase Auth (ready for multi-user)

### Database Schema
- `sensors` - IoT device registry and specifications
- `sensor_readings` - Time-series sensor data
- `milk_batches` - Batch tracking and properties
- `shelf_life_predictions` - ML prediction results
- `quality_control_data` - QC measurements
- `alerts` - Alert and notification system
- `qc_charts_data` - Pre-computed chart data
- `ml_models` - Model versioning and metadata

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun runtime
- Supabase account
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd milk-shelf-life-app
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run development server**
```bash
pnpm dev
# or
npm run dev
```

5. **Access the application**
Open http://localhost:5173 in your browser

## 📦 Build for Production

```bash
pnpm build
# or
npm run build
```

Built files will be in the `dist/` directory.

## 🔧 Edge Functions

The application uses 3 Supabase Edge Functions:

### 1. ML Prediction (`ml_prediction`)
Predicts milk shelf life based on multiple factors.

**Endpoint**: `/functions/v1/ml_prediction`

**Request**:
```json
{
  "batchId": "BATCH_001",
  "temperature": 4.2,
  "ph": 6.8,
  "bacteriaCount": 5000,
  "humidity": 85,
  "fatContent": 3.25,
  "storageDays": 2
}
```

**Response**:
```json
{
  "data": {
    "predictedShelfLifeHours": 96,
    "confidenceLower": 77,
    "confidenceUpper": 115,
    "accuracyScore": 92,
    "riskFactors": []
  }
}
```

### 2. Data Processor (`data_processor`)
Processes real-time sensor readings and generates alerts.

**Endpoint**: `/functions/v1/data_processor`

### 3. QC Charts Generator (`qc_charts_generator`)
Generates quality control chart data.

**Endpoint**: `/functions/v1/qc_charts_generator`

## 📱 Application Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Application pages
│   ├── Dashboard.tsx     # Real-time overview
│   ├── Sensors.tsx       # IoT sensor monitoring
│   ├── Prediction.tsx    # ML predictions
│   ├── QCCharts.tsx      # Quality control charts
│   ├── Alerts.tsx        # Alert management
│   └── Analytics.tsx     # Historical analytics
├── lib/              # Utilities and helpers
│   └── supabase.ts       # Supabase client
└── App.tsx           # Main application component
```

## 🎨 Design System

- **Style**: Modern Minimalism Premium
- **Colors**: 90% neutral grays + status colors (green/amber/red)
- **Typography**: Inter font family
- **Spacing**: 8pt grid system (8, 16, 24, 32, 48, 64, 96px)
- **Responsive**: Mobile-first with breakpoints at 768px, 1024px

## 🔬 Research Foundation

The application is built on comprehensive research:
- Scientific milk shelf life prediction methods
- IoT sensor specifications and accuracy requirements
- Quality control chart methodologies
- Machine learning algorithms for food safety

Research documents available in `/docs` directory.

## 🧪 Testing

Sample data is pre-populated in the database for testing:
- 4 IoT sensors (temperature, pH, bacteria, humidity)
- 3 milk batches (whole, 2%, fat-free)
- 16+ sensor readings
- Sample predictions and alerts

## 📊 Quality Control Charts

### Pareto Chart
Identifies the "vital few" defects accounting for 80% of quality issues.

### Control Charts (X-bar/R)
Monitors process stability with upper and lower control limits (3σ).

### Fishbone Diagram
Root cause analysis across 6M categories:
- Man/People
- Machine/Equipment
- Method/Process
- Material
- Measurement
- Environment

### Statistical Process Control
- Real-time SPC calculations
- Out-of-control detection
- Process capability metrics

## 🔐 Security

- Environment variables for sensitive credentials
- Supabase Row Level Security (RLS) ready
- CORS headers configured for edge functions
- Input validation on all API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

**MiniMax Agent** - Initial work and development

## 🙏 Acknowledgments

- Research based on peer-reviewed scientific literature
- Built with modern web technologies and best practices
- Designed for dairy industry professionals

## 📞 Support

For issues, questions, or feature requests, please open an issue in the GitHub repository.

---

**Live Demo**: https://wiqa9zob7b90.space.minimax.io

Built with ❤️ by MiniMax Agent
