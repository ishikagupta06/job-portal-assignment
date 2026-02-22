# 🚀 Job Portal - MERN Stack Application

A full-stack job portal application built with MongoDB, Express.js, React, and Node.js. This platform allows employers to post jobs and manage applications, while job seekers can browse jobs, apply, and track their applications.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [API Endpoints](#-api-endpoints)
- [Implementation Details](#-implementation-details)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Demo Credentials](#-demo-credentials)

---

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure password hashing (bcrypt)
- **Role-Based Access Control (RBAC)** for Employers and Job Seekers
- Protected routes with role-based access
- Session persistence with automatic token refresh
- Secure logout functionality

### 💼 Job Management
- **CRUD operations** for job listings (Create, Read, Update, Delete)
- **Advanced search** by job title, company, or description
- **Filtering** by category, location, and job type
- Job details page with full description and requirements
- Employers can create, edit, and delete their job postings

### 📝 Application System
- Job seekers can apply for jobs with one click
- Employers can view all applications for their jobs
- **Application status management**: Pending, Reviewed, Accepted, Rejected
- Employers can update application status
- Duplicate application prevention

### 📊 Dashboards

#### Employer Dashboard
- View all posted jobs with application counts
- Manage job postings (create, edit, delete)
- View and manage applications
- Update application statuses
- Statistics: Active Jobs, Total Applications, Pending Reviews, Accepted

#### Job Seeker Dashboard
- View all applied jobs
- Track application status
- Statistics: Total Applications, Under Review, Accepted, Rejected
- Application history with job details

### 🎨 User Interface
- **Modern, responsive design** with Tailwind CSS
- **Dark mode** toggle
- Smooth animations and transitions
- Mobile-friendly layout
- Intuitive navigation

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Data visualization (dashboard charts)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **MongoDB Native Driver** - Database client
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/job-portal.git
cd job-portal
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Setup

1. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

2. Update `.env` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/jobportal
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal

JWT_SECRET=your-secret-key-change-in-production
# Generate a secure secret: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4: Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. The connection string should be: `mongodb://localhost:27017/jobportal`

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string and update `MONGODB_URI` in `.env`

### Step 5: Seed the Database

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- 4 users (1 job seeker, 3 employers)
- 3 job listings
- 3 sample applications

### Step 6: Run the Application

**Terminal 1 - Start Backend Server:**
```bash
npm run server
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Step 7: Access the Application

Open your browser and navigate to: `http://localhost:5173`

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (employer or job seeker)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)

### Jobs
- `GET /api/jobs` - Get all jobs (with optional query params: search, category, location, type, employerId)
- `GET /api/jobs/:id` - Get single job by ID
- `POST /api/jobs` - Create new job (employer only)
- `PUT /api/jobs/:id` - Update job (employer who owns it)
- `DELETE /api/jobs/:id` - Delete job (employer who owns it)

### Applications
- `POST /api/applications` - Apply for a job (job seeker only)
- `GET /api/applications` - Get applications (role-based: job seekers see theirs, employers see their jobs' applications)
- `PUT /api/applications/:id/status` - Update application status (employer only)

### Health Check
- `GET /api/health` - Server health check

---

## 🔧 Implementation Details

### Authentication System

**JWT Token Flow:**
1. User registers/logs in → Server validates credentials
2. Server generates JWT token with user info (id, email, role)
3. Token stored in localStorage on frontend
4. Token sent in `Authorization: Bearer <token>` header for protected routes
5. Server validates token on each request
6. Token expires after 7 days (configurable)

**Password Security:**
- Passwords hashed using bcrypt (10 rounds)
- Original passwords never stored in database
- Secure password comparison on login

**Role-Based Access Control:**
- Middleware checks user role before allowing access
- Protected routes redirect unauthorized users
- Role-based UI rendering (employer vs job seeker features)

### Job Management

**CRUD Operations:**
- Jobs stored in MongoDB `jobs` collection
- Each job linked to employer via `employerId`
- Employers can only edit/delete their own jobs
- Job deletion also removes associated applications

**Search & Filter:**
- Server-side search using MongoDB regex queries
- Filters: category, location, job type
- Search across title, company, and description
- Results sorted by posted date (newest first)

### Application System

**Application Flow:**
1. Job seeker views job details
2. Clicks "Apply Now" → Creates application record
3. Application stored with status "pending"
4. Employer views applications in dashboard
5. Employer updates status: pending → reviewed → accepted/rejected

**Duplicate Prevention:**
- Server checks if user already applied before creating new application
- Returns 409 Conflict if duplicate detected

### State Management

**Zustand Store:**
- `currentUser` - Currently logged-in user
- `isDarkMode` - Dark mode preference
- `authLoading` - Authentication loading state
- `applications` - User's applications (for job seekers)
- `users` - Cached user data

**API Integration:**
- Centralized API client with automatic token injection
- Error handling and response parsing
- Environment-based API URL configuration

### Protected Routes

**Route Protection:**
- `ProtectedRoute` component wraps sensitive routes
- Checks authentication status
- Validates user role
- Redirects to login if unauthorized
- Shows loading state during auth check

---

## 📁 Project Structure

```
job-portal/
├── server/                 # Backend Express server
│   ├── routes/            # API route handlers
│   │   ├── auth.js        # Authentication routes
│   │   ├── jobs.js        # Job CRUD routes
│   │   └── applications.js # Application routes
│   ├── middleware/        # Express middleware
│   │   └── auth.js        # JWT & RBAC middleware
│   ├── db.js              # MongoDB connection
│   └── index.js           # Express app entry point
│
├── src/                   # Frontend React app
│   ├── api/               # API client functions
│   │   ├── client.ts      # Base API client
│   │   ├── auth.ts        # Auth API calls
│   │   ├── jobs.ts        # Jobs API calls
│   │   └── applications.ts # Applications API calls
│   ├── components/        # React components
│   │   ├── Navbar.tsx     # Navigation bar
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── pages/             # Page components
│   │   ├── Home.tsx       # Landing page
│   │   ├── Jobs.tsx       # Job listings
│   │   ├── JobDetails.tsx # Job detail page
│   │   ├── Login.tsx      # Login page
│   │   ├── Register.tsx   # Registration page
│   │   ├── CreateJob.tsx  # Create job (employer)
│   │   ├── EditJob.tsx    # Edit job (employer)
│   │   ├── EmployerDashboard.tsx # Employer dashboard
│   │   └── JobSeekerDashboard.tsx # Job seeker dashboard
│   ├── store/             # Zustand state management
│   │   └── index.ts       # Store configuration
│   ├── types/             # TypeScript types
│   │   └── index.ts       # Type definitions
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styles
│
├── scripts/               # Utility scripts
│   └── seed.js           # Database seeding script
│
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md            # This file
```

---

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/jobportal` or `mongodb+srv://user:pass@cluster.mongodb.net/jobportal` |
| `JWT_SECRET` | Secret key for JWT tokens | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `VITE_API_URL` | Frontend API URL (for production) | `http://localhost:5000/api` |

---

## 👤 Demo Credentials

After running `npm run seed`, you can login with:

### Job Seeker
- **Email:** `john@example.com`
- **Password:** `password123`

### Employer (TechCorp)
- **Email:** `jane@techcorp.com`
- **Password:** `password123`

### Other Employers
- `hr@designhub.com` / `password123`
- `recruit@growthco.com` / `password123`

---

## 🚢 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variable: `VITE_API_URL` = your backend URL + `/api`
4. Deploy

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `PORT=10000`
6. Deploy

See deployment configuration files (`vercel.json`, `render.yaml`) for details.

---

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend development server |
| `npm run server` | Start backend Express server |
| `npm start` | Start backend server (alias for `npm run server`) |
| `npm run build` | Build frontend for production |
| `npm run seed` | Seed database with sample data |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

---

## 🎯 Key Features Implemented

✅ **User Authentication** - JWT-based auth with RBAC  
✅ **Job CRUD** - Full create, read, update, delete operations  
✅ **Search & Filter** - Advanced job search and filtering  
✅ **Application System** - Job seekers can apply, employers can manage  
✅ **Dashboards** - Separate dashboards for employers and job seekers  
✅ **Protected Routes** - Role-based route protection  
✅ **Responsive Design** - Mobile-friendly UI  
✅ **Dark Mode** - Theme toggle functionality  

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

Built as part of a MERN stack assessment project.

---

## 🙏 Acknowledgments

- MongoDB Atlas for free database hosting
- Vercel and Render for free hosting platforms
- All open-source libraries and frameworks used

---

**Happy Job Hunting! 🎉**
