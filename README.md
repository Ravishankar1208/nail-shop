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

The backend uses a local `.env` file with:

- PORT=5000
- MONGO_URI=mongodb://127.0.0.1:27017/nailshop
- JWT_SECRET=your_secret
- CLIENT_URL=http://localhost:5173

The frontend uses this API origin; the API service appends `/api`:

- VITE_API_URL=http://localhost:5000
