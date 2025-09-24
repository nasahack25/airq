# ☁️ AirQ - Global Air Quality Forecasting Platform

## 🎯 Overview

AirQ is a sophisticated, full-stack web application developed for the **NASA Space Apps Challenge**. It provides real-time, hyperlocal air quality data and predictive **8-hour forecasts** for any location globally.

Born from the need to democratize environmental data, **AirQ** combines:
- Real-time data from global monitoring stations
- Advanced weather modeling
- NASA TEMPO satellite data (for North America)
- Community-driven insights

into an intuitive, user-friendly platform that helps people make informed decisions about their outdoor activities.

## 🌐 Live Demo

| Service | URL | Status |
|---------|-----|--------|
| Frontend | [airq-nasa.vercel.app](https://airq-nasa.vercel.app) | [![Vercel](https://img.shields.io/badge/vercel-live-brightgreen.svg)](https://airq-nasa.vercel.app) |
| API Gateway | [airqapi.vercel.app](https://airqapi.vercel.app) | [![Vercel](https://img.shields.io/badge/vercel-live-brightgreen.svg)](https://airqapi.vercel.app) |
| Forecast Service | [https://airq-pgcv.onrender.com](https://airq-pgcv.onrender.com) | [![Render](https://img.shields.io/badge/render-live-brightgreen.svg)](https://airq-pgcv.onrender.com) |

## ✨ Key Features

### 🌍 Global Coverage
- Real-time AQI and weather data for any location
- Integration with major global air quality monitoring networks
- Support for multiple AQI standards (US EPA, European, etc.)

### 🧠 Advanced Forecasting
- 8-hour predictive air quality forecasts
- Scientific advection model for pollution movement simulation
- Wind pattern analysis and incorporation
- Machine learning-enhanced predictions

### 🗺️ Interactive Visualization
- High-resolution, interactive mapping
- NASA TEMPO satellite data overlay (North America)
- Custom AQI color gradients and markers
- Real-time wind visualization

### 👥 Community Platform
- User profiles and authentication
- Post creation with image support
- Comments and likes functionality
- Location-based community filtering

### 🔐 Enterprise-Grade Security
- JWT-based authentication
- HTTP-only secure cookies
- Google OAuth integration
- Rate limiting and DDOS protection

## 🛠️ Technology Stack

This project employs a modern monorepo architecture using **Turborepo** and **pnpm**, with a microservices backend approach.

### Core Technologies

```mermaid
graph TB
Frontend[Frontend: Next.js + React + TypeScript]
API[API Gateway: Node.js + Express + TypeScript]
Forecast[Forecast Service: Python + FastAPI]
DB[(PostgreSQL)]

Frontend --> API
Frontend --> Forecast
API --> DB
API --> Forecast
```

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 14, React 18, TypeScript 5, Tailwind CSS, Framer Motion |
| **API Gateway** | Node.js 20, Express.js 4, TypeScript 5, Prisma ORM |
| **Forecast Service** | Python 3.12, FastAPI, NumPy, SciPy |
| **Database** | PostgreSQL 15 |
| **DevOps** | Docker, GitHub Actions, Vercel, Render |

### Key Libraries & Services

- **Maps**: Leaflet with custom tile layers
- **Charts**: Recharts for performance metrics
- **Data Validation**: Zod schema validation
- **Authentication**: Passport.js, JWT
- **File Handling**: Multer, Cloudinary
- **State Management**: React Context + Hooks
- **Testing**: Jest, React Testing Library
- Python: `v3.9` or later  
- Git  

---

### 2. Clone the Repository
```bash
git clone https://github.com/nasahack25/airq.git
cd airq
```

### Required Environment Variables

Create `.env` files for each service in the monorepo:

#### Frontend (`apps/frontend/.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_OPENCAGE_API_KEY=your_opencage_api_key
```

#### API Gateway (`apps/api/.env`)
```env
# Server Configuration
PORT=3001
DATABASE_URL="postgresql://user:password@host:port/database"
FORECAST_SERVICE_URL=http://localhost:3002/api/v1/forecast

# Authentication
JWT_SECRET=your_strong_jwt_secret
SESSION_SECRET=your_strong_session_secret
FRONTEND_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Forecast Service (`apps/forecast-microservice/.env`)
```env
AQICN_API_KEY=your_waqi_project_api_key
```

### Database Setup

The project uses PostgreSQL. For development, you can use:
- Local PostgreSQL installation
- Free tier from [Neon](https://neon.tech)
- Free tier from [Supabase](https://supabase.com)

1. Get your database connection URL
2. Update `DATABASE_URL` in `apps/api/.env`
3. Initialize the database:
   ```bash
   cd apps/api
   # Create and seed the database
   pnpm prisma migrate dev
   pnpm prisma generate
   ```

## 💝 Support the Project

If you find AirQ useful, consider:
- Giving us a ⭐️ on GitHub
- Sharing the project
- [Contributing](CONTRIBUTING.md) to development
- [Sponsoring](https://github.com/sponsors/airq) the project

---

Built with ❤️ by the AirQ Team for NASA Space Apps Challenge 2025
pnpm prisma generate
pnpm prisma db push
cd ../..

6. Run the Application

Start all three services concurrently using Turborepo:

`pnpm dev`


Your services will now run locally:

Frontend → http://localhost:3000

Node.js API → http://localhost:3001

Python Microservice → http://localhost:3002

📂 Project Structure
```/
├── apps/
│   ├── api/                  # Node.js Express API Gateway (Auth, Community)
│   ├── frontend/             # Next.js Frontend
│   └── forecast-microservice/ # Python FastAPI Microservice (Forecasting)
├── packages/
│   └── ui/                   # Shared UI components (optional)
├── turbo.json
└── package.json
```
