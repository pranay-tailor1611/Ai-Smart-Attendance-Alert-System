# Smart Attendance AI — Agentic Attendance Alert System

Production-ready **React + Node.js + MongoDB** system with **Gemini API** and **LangGraph** multi-agent workflow for attendance prediction, smart alerts, personalized recommendations, and analytics dashboards.

## Features

- **Roles:** Admin, Faculty, Student (JWT + RBAC)
- **Attendance:** Mark bulk/daily, % formula, subject-wise & monthly trends
- **AI Agents (LangGraph):** Monitoring → Prediction → Alerts → Recommendations → Report log
- **Alerts:** Green (85%+), Yellow (75–85%), Red (&lt;75%) + Nodemailer emails
- **Reports:** PDF (jsPDF) & Excel (XLSX) with risk status & AI recommendations
- **UI:** Dark mode, glassmorphism cards, sidebar, Recharts, toasts, skeletons

## Tech Stack

| Layer | Stack |
|-------|--------|
| Frontend | React, Vite, Tailwind, React Router, Axios, Recharts |
| Backend | Node.js, Express, Mongoose, JWT |
| AI | Google Gemini, LangGraph |

## Project Structure

```
smart-attendance-ai/
├── client/          # React frontend
├── server/          # Express API + agents
├── package.json
├── .env.example
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or Atlas URI
- (Optional) [Gemini API key](https://aistudio.google.com/apikey)
- (Optional) SMTP credentials for email alerts

## Quick Start

```bash
cd smart-attendance-ai

# Install dependencies
npm run install:all

# Configure environment
copy .env.example server\.env
# Edit server\.env — set MONGODB_URI, JWT_SECRET, GEMINI_API_KEY

# Seed demo data (admin, faculty, students + attendance)
npm run seed --prefix server

# Run dev (API :5000 + UI :5173)
npm run dev
```

Open **http://localhost:5173**

### Demo Accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.edu | admin123 |
| Faculty | faculty@college.edu | faculty123 |
| Student | rahul@student.edu | student123 |

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/dashboard/admin` | Admin dashboard |
| POST | `/api/attendance/bulk` | Mark attendance |
| POST | `/api/ai/workflow/:studentId` | Run LangGraph agents |
| POST | `/api/ai/workflow/bulk` | Bulk AI monitoring |
| GET | `/api/reports/pdf` | Download PDF |
| GET | `/api/reports/excel` | Download Excel |

## LangGraph Agent Pipeline

1. **Monitoring** — current %, defaulter flag, weakest subject  
2. **Prediction** — Gemini + trend analysis, classes needed for 75%  
3. **Alerts** — DB notifications + email (yellow/red)  
4. **Recommendations** — personalized Gemini suggestions  
5. **Report** — workflow metadata logged to `Reports` collection  

Without `GEMINI_API_KEY`, agents use deterministic fallbacks (system still works).

## Production Build

```bash
# Build frontend
npm run build --prefix client

# Set NODE_ENV=production and serve from Express
set NODE_ENV=production
npm run start --prefix server
```

Deploy MongoDB (Atlas), set env vars on your host (Railway, Render, VPS), and use HTTPS + strong `JWT_SECRET`.

## Resume Line

> Developed an Agentic AI Smart Attendance Alert System using React, Node.js, MongoDB, Gemini API, and LangGraph for attendance prediction, automated alerts, personalized recommendations, and real-time analytics dashboards.

## License

MIT
