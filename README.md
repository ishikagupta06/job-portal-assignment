# 🚀 Job Portal - MERN Stack Assessment

## 📌 Overview

This project serves as a **starter template** for building a **fully functional Job Portal** using the **MERN (MongoDB, Express.js, React, Node.js) stack**.

Candidates are expected to implement **both frontend and backend features** to deliver a **complete** job portal web application.

---

## 🛠️ Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. MongoDB Database Setup

1. **Create `.env`** (copy from `.env.example` and add your MongoDB URI):
   ```
   MONGODB_URI=mongodb://localhost:27017/jobportal
   JWT_SECRET=your-secret-key-change-in-production
   ```

2. **Seed the database** with sample data:
   ```bash
   npm run seed
   ```

See **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** for full setup (Atlas, Compass, mongosh) and collection schemas.

### 3. Run the application

**Terminal 1 – Backend (Express API):**
```bash
npm run server
```

**Terminal 2 – Frontend (Vite):**
```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000

**Demo login** (after seeding): `john@example.com` / `password123` (Job Seeker) or `jane@techcorp.com` / `password123` (Employer)

---

## 🎯 Assessment Tasks

### 1️⃣ User Authentication System ✅

- JWT-based authentication with `jsonwebtoken` and `bcryptjs`.
- **RBAC** for **Employers** and **Job Seekers** (protected routes, role-based dashboards).
- Endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.

### 2️⃣ Job Listings & Search

- Develop **API endpoints** to **Create, Read, Update, and Delete (CRUD)** job listings.
- Implement a **search and filtering system** for job listings.

### 3️⃣ Job Application System

- Allow **Job Seekers** to apply for jobs.
- Enable **Employers** to **view applicants** for their job listings.

### 4️⃣ Employer & Job Seeker Dashboards

- **Employers Dashboard**: Manage **job postings** and **view applicants**.
- **Job Seekers Dashboard**: Track **applied jobs** and manage applications.

### 5️⃣ Extend Functionality & Design

- Feel free to add **new features**, **improvements**, or **design enhancements** to showcase your skills.

---

## 📌 Submission Guidelines

1. **Push your code** to a **GitHub repository**.
2. Provide a **README.md** with:
   - **Setup Instructions**
   - **Features & Implementation Details**
3. **Deploy the application** on any hosting platform (**Vercel, Render, etc.**).
4. **Submit the live link** along with the **repository link**.

---
