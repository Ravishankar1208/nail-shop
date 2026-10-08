# Nail Shop MERN Project

This repository contains a React + Vite frontend and a Node.js + Express + MongoDB backend for a nail shop e-commerce application.

## Start the frontend

```bash
npm install --prefix frontend
npm --prefix frontend run dev
```

## Start the backend

```bash
npm install --prefix backend
npm --prefix backend run dev
```

## Environment

The backend uses `backend/.env` with private database and signing credentials. Set
`CLIENT_URL` to the deployed frontend origin in production; it defaults to the
Vercel frontend and localhost origins remain allowed for development.

The frontend uses `VITE_API_URL` as the backend origin. The API service adds
`/api` exactly once, so configure the origin without `/api`:

- Production: `https://nail-shop-y0hs.onrender.com`
- Local development: `http://localhost:5000`

The production frontend value is in `frontend/.env.production`. For local
development, copy `frontend/.env.example` to `frontend/.env.local`. Vite loads
`.env.local` for local runs, and it is git-ignored. Never put backend secrets in
frontend environment files.
