import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

function toApplicationResponse(doc) {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    jobId: doc.jobId?.toString(),
    userId: doc.userId?.toString(),
    status: doc.status,
    appliedDate: doc.appliedDate ? new Date(doc.appliedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    coverLetter: doc.coverLetter || '',
    resume: doc.resume || '',
  };
}

// POST /api/applications - Apply for a job (job seeker only)
router.post('/', authenticate, requireRole('jobseeker'), async (req, res) => {
  try {
    const db = getDB();
    const { jobId, coverLetter, resume } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    const job = await db.collection('jobs').findOne({ _id: new ObjectId(jobId) });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already applied
    const existing = await db.collection('applications').findOne({
      jobId: new ObjectId(jobId),
      userId: new ObjectId(req.user.id),
    });

    if (existing) {
      return res.status(409).json({ error: 'Already applied to this job' });
    }

    const appDoc = {
      jobId: new ObjectId(jobId),
      userId: new ObjectId(req.user.id),
      status: 'pending',
      coverLetter: coverLetter?.trim() || '',
      resume: resume?.trim() || '',
      appliedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('applications').insertOne(appDoc);
    const application = toApplicationResponse({ _id: result.insertedId, ...appDoc });

    res.status(201).json({ application });
  } catch (err) {
    console.error('Create application error:', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// GET /api/applications - List applications
// For job seekers: their own applications
// For employers: applications for their jobs
router.get('/', authenticate, async (req, res) => {
  try {
    const db = getDB();
    const { jobId, userId } = req.query;
    const query = {};

    if (req.user.role === 'jobseeker') {
      query.userId = new ObjectId(req.user.id);
    } else if (req.user.role === 'employer') {
      // Get employer's job IDs
      const employerJobs = await db.collection('jobs')
        .find({ employerId: new ObjectId(req.user.id) })
        .toArray();
      const jobIds = employerJobs.map(j => j._id);
      if (jobIds.length === 0) {
        return res.json({ applications: [] });
      }
      query.jobId = { $in: jobIds };
    }

    if (jobId && ObjectId.isValid(jobId)) {
      query.jobId = new ObjectId(jobId);
    }
    if (userId && ObjectId.isValid(userId)) {
      query.userId = new ObjectId(userId);
    }

    const applications = await db.collection('applications')
      .find(query)
      .sort({ appliedDate: -1 })
      .toArray();

    // Populate job and user info
    const populated = await Promise.all(
      applications.map(async (app) => {
        const job = await db.collection('jobs').findOne({ _id: app.jobId });
        const user = await db.collection('users').findOne({ _id: app.userId });
        return {
          ...toApplicationResponse(app),
          job: job ? {
            id: job._id.toString(),
            title: job.title,
            company: job.company,
          } : null,
          applicant: user ? {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          } : null,
        };
      })
    );

    res.json({ applications: populated });
  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// PUT /api/applications/:id/status - Update application status (employer only)
router.put('/:id/status', authenticate, requireRole('employer'), async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    const validStatuses = ['pending', 'reviewed', 'rejected', 'accepted'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const application = await db.collection('applications').findOne({ _id: new ObjectId(id) });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Verify employer owns the job
    const job = await db.collection('jobs').findOne({ _id: application.jobId });
    if (!job || job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    await db.collection('applications').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    const updated = await db.collection('applications').findOne({ _id: new ObjectId(id) });
    const populated = {
      ...toApplicationResponse(updated),
      job: {
        id: job._id.toString(),
        title: job.title,
        company: job.company,
      },
    };

    res.json({ application: populated });
  } catch (err) {
    console.error('Update application status error:', err);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

export default router;
