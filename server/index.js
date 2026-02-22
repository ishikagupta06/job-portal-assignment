import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import jobsRoutes from './routes/jobs.js';
import applicationsRoutes from './routes/applications.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Health check endpoint (for Render/Vercel)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// CORS - allow all origins (you can restrict to specific domains in production)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
