# CrimeVista Frontend

<div align="center">

# 🚔 CrimeVista
### AI-Powered Crime Intelligence Platform

**Frontend Application for Karnataka State Police**

Enterprise dashboard built using React, TypeScript and modern web technologies to assist law enforcement agencies with crime intelligence, predictive analytics and real-time monitoring.

</div>

---

# Overview

CrimeVista is a modern AI-powered crime intelligence dashboard designed to assist Karnataka State Police in analyzing FIR records, monitoring crime trends, identifying hotspots, visualizing criminal relationships, and generating predictive insights.

The frontend serves as the primary interface through which officers interact with crime data, analytical dashboards, maps, reports and AI-generated intelligence.

---

# Objectives

The frontend was designed to provide:

- Clean enterprise-grade user experience
- Fast access to intelligence reports
- Interactive crime analytics
- Real-time incident monitoring
- Easy navigation between investigation modules
- Responsive layout for different screen sizes

---

# Technology Stack

| Technology | Purpose |
|------------|----------|
| React 19 | Frontend Framework |
| TypeScript | Type Safety |
| Vite | Development & Build Tool |
| Tailwind CSS v4 | Styling |
| TanStack Router | Client-side Routing |
| TanStack Query | Server State Management |
| Radix UI | Accessible UI Components |
| Lucide React | Icons |
| React Hook Form | Form Handling |

---

# Folder Structure

```text
frontend
│
├── public/
│
├── src/
│   ├── assets/
│   │      Logos
│   │      Images
│   │
│   ├── components/
│   │      auth/
│   │      crimevista/
│   │      ui/
│   │
│   ├── lib/
│   ├── routes/
│   ├── styles.css
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

# Core Modules

## Intelligence Brief

Provides an overview of:

- Today's FIR registrations
- Active investigations
- High-risk districts
- Solved cases
- AI prediction accuracy
- Emergency alerts

---

## FIR Intelligence

- FIR search
- Case lookup
- Officer details
- Crime categorization
- Investigation status

---

## Crime Heatmap

Displays geographical crime concentration using map visualizations to identify hotspots across districts.

---

## Relationship Intelligence

Visualizes relationships between:

- Suspects
- Criminal groups
- Cases
- Victims
- Locations

using graph-based intelligence.

---

## Predictive Analytics

AI-driven module that predicts:

- Crime trends
- High-risk locations
- Future hotspot probability
- District-wise risk analysis

---

## Alerts & Notifications

Displays

- Emergency alerts
- Crime spikes
- New incidents
- AI-generated warnings

---

## Reports & Analytics

Generate:

- Investigation reports
- Crime summaries
- Statistical dashboards
- District performance reports

---

## Case Management

Manage investigation workflow including:

- Active cases
- Officer assignments
- Investigation status
- Case timelines

---

## Administration

Administrative interface for managing:

- User roles
- Permissions
- System settings
- Audit information

---

# UI Components

The application includes reusable components such as:

- Sidebar Navigation
- Top Navigation Bar
- KPI Cards
- Charts
- Data Tables
- Search Components
- Filters
- Status Badges
- Footer
- Dashboard Widgets

---

# Features

- Responsive Layout
- Modern Enterprise UI
- Karnataka Police Branding
- AI Dashboard
- Real-time Dashboard Layout
- Modular Component Architecture
- Reusable UI Components
- Accessible Design
- Type-safe Development

---

# Development

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

Build production bundle

```bash
npm run build
```

---

# Future Enhancements

- Authentication using JWT
- Role-Based Access Control (RBAC)
- Live Crime Feed Integration
- WebSocket Notifications
- GIS Map Integration
- AI Chat Assistant
- Offline Support
- Dark / Light Theme Toggle

---

# Contributors

Frontend Development

- Shivaleela Ballary

---

# Project

CrimeVista was developed as part of an AI-powered Crime Intelligence Platform for the Karnataka State Police.

This frontend focuses on providing a scalable, responsive and user-friendly interface for crime data visualization and intelligence-driven policing.