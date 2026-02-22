import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'jobportal-dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function toUserResponse(doc) {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    company: doc.company,
  };
}

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const db = getDB();
    const { name, email, password, role, company } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    if (!['employer', 'jobseeker'].includes(role)) {
      return res.status(400).json({ error: 'Role must be employer or jobseeker' });
    }

    if (role === 'employer' && !company) {
      return res.status(400).json({ error: 'Company name is required for employers' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userDoc = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      company: role === 'employer' ? company?.trim() : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(userDoc);
    const user = toUserResponse({ _id: result.insertedId, ...userDoc });
    const token = createToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const db = getDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userDoc = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (!userDoc) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, userDoc.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = toUserResponse(userDoc);
    const token = createToken(user);

    res.json({ user, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me - get current user (requires valid token)
router.get('/me', authenticate, async (req, res) => {
  try {
    const db = getDB();
    const userDoc = await db.collection('users').findOne({ _id: new ObjectId(req.user.id) });
    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = toUserResponse(userDoc);
    res.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
