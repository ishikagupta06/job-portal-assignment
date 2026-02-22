import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';
import { authenticate, requireRole, optionalAuth } from '../middleware/auth.js';

const router = Router();

function toJobResponse(doc) {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    title: doc.title,
    company: doc.company,
    location: doc.location,
    type: doc.type,
    salary: doc.salary,
    description: doc.description,
    requirements: doc.requirements || [],
    category: doc.category,
    postedDate: doc.postedDate ? new Date(doc.postedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    employerId: doc.employerId?.toString(),
  };
}

// GET /api/jobs - List jobs with search and filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const db = getDB();
    const { search, category, location, type, employerId } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    if (employerId) query.employerId = new ObjectId(employerId);

    const jobs = await db.collection('jobs').find(query).sort({ postedDate: -1 }).toArray();
    res.json({ jobs: jobs.map(toJobResponse) });
  } catch (err) {
    console.error('Get jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET /api/jobs/:id - Get single job
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const db = getDB();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }
    const job = await db.collection('jobs').findOne({ _id: new ObjectId(req.params.id) });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ job: toJobResponse(job) });
  } catch (err) {
    console.error('Get job error:', err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// POST /api/jobs - Create job (employer only)
router.post('/', authenticate, requireRole('employer'), async (req, res) => {
  try {
    const db = getDB();
    const { title, location, type, salary, description, requirements, category } = req.body;

    if (!title || !location || !type || !salary || !description || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userDoc = await db.collection('users').findOne({ _id: new ObjectId(req.user.id) });
    if (!userDoc || !userDoc.company) {
      return res.status(400).json({ error: 'Employer company not found' });
    }

    const jobDoc = {
      title: title.trim(),
      company: userDoc.company,
      location: location.trim(),
      type: type.trim(),
      salary: salary.trim(),
      description: description.trim(),
      requirements: Array.isArray(requirements) ? requirements.map(r => r.trim()).filter(Boolean) : [],
      category: category.trim(),
      employerId: new ObjectId(req.user.id),
      postedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('jobs').insertOne(jobDoc);
    const job = toJobResponse({ _id: result.insertedId, ...jobDoc });

    res.status(201).json({ job });
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// PUT /api/jobs/:id - Update job (employer who owns it)
router.put('/:id', authenticate, requireRole('employer'), async (req, res) => {
  try {
    const db = getDB();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    const job = await db.collection('jobs').findOne({ _id: new ObjectId(req.params.id) });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    const { title, location, type, salary, description, requirements, category } = req.body;
    const update = { updatedAt: new Date() };

    if (title) update.title = title.trim();
    if (location) update.location = location.trim();
    if (type) update.type = type.trim();
    if (salary) update.salary = salary.trim();
    if (description) update.description = description.trim();
    if (requirements) update.requirements = Array.isArray(requirements) ? requirements.map(r => r.trim()).filter(Boolean) : [];
    if (category) update.category = category.trim();

    await db.collection('jobs').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: update }
    );

    const updated = await db.collection('jobs').findOne({ _id: new ObjectId(req.params.id) });
    res.json({ job: toJobResponse(updated) });
  } catch (err) {
    console.error('Update job error:', err);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// DELETE /api/jobs/:id - Delete job (employer who owns it)
router.delete('/:id', authenticate, requireRole('employer'), async (req, res) => {
  try {
    const db = getDB();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    const job = await db.collection('jobs').findOne({ _id: new ObjectId(req.params.id) });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    await db.collection('jobs').deleteOne({ _id: new ObjectId(req.params.id) });
    await db.collection('applications').deleteMany({ jobId: new ObjectId(req.params.id) });

    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Delete job error:', err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;
