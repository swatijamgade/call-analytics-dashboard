# Call Analytics Dashboard

A React + Vite analytics dashboard that consumes telecom CDR data and visualizes key call metrics in a SaaS-style interface.

## Project Description

This dashboard fetches Call Data Records (CDR) from the provided API and transforms the raw records into actionable analytics for:

- call activity monitoring
- customer engagement tracking
- call success/failure monitoring
- cost analysis
- city-level call pattern analysis

## Technology Stack

- React (Vite)
- TailwindCSS
- shadcn/ui
- Recharts

## API

Default data source:

`https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr`

You can override the API URL with an environment variable:

`VITE_CDR_API_URL`

## Implemented Features

1. KPI Summary Cards
- Total Calls
- Total Call Cost
- Average Call Duration
- Total Successful Calls
- Total Failed Calls

2. Call Duration Analytics
- Longest Call
- Shortest Call
- Average Duration
- Bar chart

3. Call Cost Analytics
- Total cost by city
- Average cost per call
- Bar + line charts

4. Call Activity Timeline
- Calls per hour
- Calls per day
- Line charts

5. Calls by City
- City vs number of calls
- Bar + pie charts

6. Recent Call Logs Table
- Caller Name
- Caller Number
- Receiver Number
- City
- Duration
- Cost
- Start Time

## Local Setup

```bash
npm install
cp .env.example .env
# edit .env and set VITE_CDR_API_URL if needed
npm run dev
```

Open: `http://localhost:3000`

Note: after changing `.env`, restart the dev server.

## Build and Lint

```bash
npm run lint
npm run build
```

## Screenshots

Add screenshots in this section before submission.

## Deployment Link (Vercel)

Add deployed URL here before submission.
