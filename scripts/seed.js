import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Load .env from project root
config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';

// Demo password for all seeded users: password123
const DEMO_PASSWORD = 'password123';

const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: null, 
    role: 'jobseeker',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Jane Smith',
    email: 'jane@techcorp.com',
    password: null,
    role: 'employer',
    company: 'TechCorp Inc.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'DesignHub HR',
    email: 'hr@designhub.com',
    password: null,
    role: 'employer',
    company: 'DesignHub',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'GrowthCo Recruiter',
    email: 'recruit@growthco.com',
    password: null,
    role: 'employer',
    company: 'GrowthCo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const jobs = [
  {
    title: 'Senior React Developer',
    company: 'TechCorp Inc.',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    description: 'We are looking for a senior React developer to join our team...',
    requirements: [
      '5+ years of React experience',
      'TypeScript proficiency',
      'Experience with state management',
    ],
    category: 'Development',
    postedDate: new Date('2024-03-10'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'UI/UX Designer',
    company: 'DesignHub',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$90,000 - $120,000',
    description: 'Join our creative team as a UI/UX Designer...',
    requirements: [
      '3+ years of design experience',
      'Proficiency in Figma',
      'Strong portfolio',
    ],
    category: 'Design',
    postedDate: new Date('2024-03-09'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Marketing Manager',
    company: 'GrowthCo',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$100,000 - $130,000',
    description: 'Lead our marketing initiatives...',
    requirements: [
      '5+ years of marketing experience',
      'Experience with digital marketing',
      'Strong analytical skills',
    ],
    category: 'Marketing',
    postedDate: new Date('2024-03-08'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();

    // Clear existing data (optional - comment out to append instead of replace)
    await db.collection('users').deleteMany({});
    await db.collection('jobs').deleteMany({});
    await db.collection('applications').deleteMany({});
    console.log('Cleared existing collections');

    // Hash passwords and insert users
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
    const usersToInsert = users.map((u) => ({ ...u, password: hashedPassword }));

    const usersResult = await db.collection('users').insertMany(usersToInsert);
    const userIds = Object.values(usersResult.insertedIds);
    console.log(`Inserted ${usersResult.insertedCount} users`);

    // Map employer to jobs: TechCorp->user[1], DesignHub->user[2], GrowthCo->user[3]
    const jobsWithEmployer = jobs.map((job, i) => ({
      ...job,
      employerId: userIds[i + 1], // users[0]=John(jobseeker), users[1]=Jane, users[2]=DesignHub, users[3]=GrowthCo
    }));

    const jobsResult = await db.collection('jobs').insertMany(jobsWithEmployer);
    const jobIds = Object.values(jobsResult.insertedIds);
    console.log(`Inserted ${jobsResult.insertedCount} jobs`);

    // Insert applications (John applied to all 3 jobs)
    const applications = [
      {
        jobId: jobIds[0],
        userId: userIds[0],
        status: 'pending',
        coverLetter: 'I am excited to apply for this position...',
        resume: 'https://example.com/resume.pdf',
        appliedDate: new Date('2024-03-12'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        jobId: jobIds[1],
        userId: userIds[0],
        status: 'accepted',
        coverLetter: 'I believe I would be a great fit...',
        resume: 'https://example.com/resume.pdf',
        appliedDate: new Date('2024-03-10'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        jobId: jobIds[2],
        userId: userIds[0],
        status: 'rejected',
        coverLetter: 'I am interested in this opportunity...',
        resume: 'https://example.com/resume.pdf',
        appliedDate: new Date('2024-03-08'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const appsResult = await db.collection('applications').insertMany(applications);
    console.log(`Inserted ${appsResult.insertedCount} applications`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\nDemo login credentials (password: password123):');
    console.log('  Job Seeker: john@example.com');
    console.log('  Employer (TechCorp): jane@techcorp.com');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

seed();
