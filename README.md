# Pulse Dashboard — Frontend (deploy to Vercel)

Vite + React + Tailwind app. Talks to the Pulse Dashboard API (deployed
separately) for cross-device sync — see the backend's README.

## Local dev

    npm install
    cp .env.example .env
    # set VITE_API_URL to your backend's URL, e.g. http://localhost:5000
    # (leave it blank to run in local-only mode with no backend at all)
    npm run dev

## Deploy to Vercel

1. Push this folder to a GitHub repo (or run `vercel` directly from inside it
   with the Vercel CLI).
2. In Vercel: **New Project** -> import the repo.
   - Framework preset: **Vite** (auto-detected)
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add an environment variable:
   - `VITE_API_URL` = the URL of your deployed backend
     (e.g. `https://pulse-dashboard-api.onrender.com`)
4. Deploy. Open the Vercel URL — the header should show a "Sync devices"
   button (not "Local only") once it can see the backend.

If you ever change `VITE_API_URL` in Vercel's settings, you need to trigger
a new deployment for it to take effect (env vars are baked in at build time
for Vite).

## Features
- Live clock, Pomodoro timer (Focus / Short break / Long break, pause & reset)
- Quick "Add Task" form (title, description, date) feeding into Today's Task
- Today's Task, To Do Daily / Weekly / Monthly checklists
- Editable quick-access tile grid, Study Tracker, Upcoming Dates
- Personal Sticky Note, Brain Dump, Focus Notes (distraction-free writing)
- Task Flows — drag-and-drop canvas to map a task into ordered, connected steps
- Prev Week Accomplishment, dark mode
- Optional MongoDB-backed sync across devices via a short code
- Fully responsive down to mobile
