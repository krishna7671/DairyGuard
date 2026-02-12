# 🥛 DairyGuard - Advanced Milk Quality Monitoring System

> **Award-Winning Hackathon Submission** | **AI-Powered Food Safety**

DairyGuard is a cutting-edge, IoT-enabled web application designed to revolutionize milk quality assurance. By combining real-time sensor data with advanced machine learning, it predicts shelf life, detects contamination risks, and provides actionable insights for dairy producers and distributors.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Tech](https://img.shields.io/badge/Stack-React%20|%20Supabase%20|%20AI-blue)
![License](https://img.shields.io/badge/License-MIT-purple)

## 🚀 Key Features

*   **🔮 AI Shelf Life Prediction**: Uses machine learning to predict exact shelf life hours based on pH, temperature, and bacterial growth models.
*   **📊 7-Point Quality Control**: Complete suite of QC charts (Pareto, X-bar, Scatter, Fishbone, etc.) for industrial-grade analysis.
*   **🦠 "Dairy Doctor" AI Agent**: Integrated value-added AI assistant that diagnoses quality issues and recommends corrective actions.
*   **📡 Simulated IoT Mesh**: Real-time sensor simulation module for demonstration without physical hardware.
*   **🔔 Smart Alerts**: Automated critical alerts for temperature abuse and spoilage risks.

## 🏗️ Architecture Overview

The system is built on a modern, scalable tech stack:

*   **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts
*   **Backend**: Supabase (PostgreSQL), Edge Functions (Deno)
*   **AI/ML**: Custom prediction algorithms & OpenAI integration
*   **Infrastructure**: Cloud-native, edge-deployed

## 📂 Repository Structure

```
DairyGuard/
├── source/                 # Main application source code
│   └── milk-shelf-life-app # React + Supabase project
├── docs/                   # Documentation, setup guides, and research
├── resources/              # Helper scripts and reference materials
└── assets/                 # Presentations and media
```

## 🛠️ Quick Start (Local Setup)

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/DairyGuard.git
    cd DairyGuard/source/milk-shelf-life-app
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup**
    Create a `.env` file in `source/milk-shelf-life-app/` with your credentials (see `docs/SAFE_API_KEY_SETUP.md`).

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

## 🛡️ Security & Privacy

*   **No Hardcoded Secrets**: All API keys are managed via environment variables.
*   **Row Level Security**: Database access is secured via Supabase RLS policies.
*   **Data Privacy**: All sensor data is anonymized for demonstration purposes.

## 👥 Team

Built with ❤️ for the Hackathon.

---
*For detailed documentation, please check the [docs/](docs/) folder.*
