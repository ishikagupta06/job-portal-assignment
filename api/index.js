// Vercel serverless function wrapper for Express app
// This allows deploying the Express backend as serverless functions on Vercel

import express from 'express';
import cors from 'cors';
import { connectDB } from '../server/db.js';
import authRoutes from '../server/routes/auth.js';
import jobsRoutes from '../server/routes/jobs.js';
import applicationsRoutes from '../server/routes/applications.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize DB connection
let dbInitialized = false;
async function initDB() {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
}

// Vercel serverless function handler
export default async function handler(req, res) {
  // Initialize DB on first request
  await initDB();
  
  // Handle the request with Express
  return app(req, res);
}
