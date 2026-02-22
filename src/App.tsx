import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import EmployerDashboard from './pages/EmployerDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const initAuth = useStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <BrowserRouter>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route
              path="/employer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/jobs/create"
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <CreateJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/jobs/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <EditJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobseeker/dashboard"
              element={
                <ProtectedRoute allowedRoles={['jobseeker']}>
                  <JobSeekerDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;