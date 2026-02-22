import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useStore } from '../store';
import { getJobs, deleteJob } from '../api/jobs';
import { getApplications, updateApplicationStatus } from '../api/applications';
import type { Job } from '../types';

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-green-400',
};

function EmployerDashboard() {
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const [jobsRes, appsRes] = await Promise.all([
          getJobs({ employerId: currentUser.id }),
          getApplications(),
        ]);
        setJobs(jobsRes.jobs);
        setApplications(appsRes.applications);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job? All applications will also be deleted.')) return;
    try {
      await deleteJob(id);
      setJobs(jobs.filter(j => j.id !== id));
      setApplications(applications.filter(app => app.jobId !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete job');
    }
  };

  const handleStatusUpdate = async (appId: string, status: 'pending' | 'reviewed' | 'rejected' | 'accepted') => {
    try {
      setUpdatingStatus(appId);
      await updateApplicationStatus(appId, status);
      setApplications(applications.map(app =>
        app.id === appId ? { ...app, status } : app
      ));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <div className={`text-center py-20 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Employer Dashboard</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Welcome back, {currentUser?.name}</p>
        </div>
        <Link to="/employer/jobs/create" className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Post New Job
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <div className={`card p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Jobs</h3>
          <p className="text-3xl font-bold text-primary-600">{jobs.length}</p>
        </div>
        <div className={`card p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Applications</h3>
          <p className="text-3xl font-bold text-green-600">{applications.length}</p>
        </div>
        <div className={`card p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pending Review</h3>
          <p className="text-3xl font-bold text-amber-500">{applications.filter(a => a.status === 'pending').length}</p>
        </div>
        <div className={`card p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Accepted</h3>
          <p className="text-3xl font-bold text-purple-500">{applications.filter(a => a.status === 'accepted').length}</p>
        </div>
      </div>

      <div className={`card overflow-hidden mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold p-6 border-b border-gray-200 dark:border-gray-700">My Job Postings</h2>
        <div className="overflow-x-auto">
          {jobs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="mb-4">No jobs posted yet.</p>
              <Link to="/employer/jobs/create" className="btn-primary inline-block">
                Create Your First Job
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Applications</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Posted</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const jobApps = applications.filter(app => app.jobId === job.id);
                  return (
                    <tr key={job.id} className={`border-t ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <Link to={`/jobs/${job.id}`} className="font-medium text-primary-600 hover:underline">
                          {job.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">{job.category}</td>
                      <td className="px-6 py-4">{jobApps.length}</td>
                      <td className="px-6 py-4 text-gray-500">{job.postedDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}
                            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className={`p-2 rounded-lg ${isDarkMode ? 'bg-red-900/30 hover:bg-red-900/50' : 'bg-red-50 hover:bg-red-100'} text-red-600`}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className={`card overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold p-6 border-b border-gray-200 dark:border-gray-700">Applications</h2>
        <div className="overflow-x-auto">
          {applications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No applications yet</div>
          ) : (
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Job Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Applicant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className={`border-t ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 font-medium">
                      {app.job ? (
                        <Link to={`/jobs/${app.jobId}`} className="text-primary-600 hover:underline">
                          {app.job.title}
                        </Link>
                      ) : (
                        'Unknown Job'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {app.applicant ? app.applicant.name : 'Unknown'}
                      {app.applicant && (
                        <div className="text-sm text-gray-500">{app.applicant.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{app.appliedDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[app.status] ?? ''}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {app.status !== 'accepted' && (
                          <button
                            onClick={() => handleStatusUpdate(app.id, 'accepted')}
                            disabled={updatingStatus === app.id}
                            className={`p-2 rounded-lg bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 disabled:opacity-50`}
                            title="Accept"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                            disabled={updatingStatus === app.id}
                            className={`p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 disabled:opacity-50`}
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {app.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(app.id, 'reviewed')}
                            disabled={updatingStatus === app.id}
                            className={`p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 disabled:opacity-50`}
                            title="Mark as Reviewed"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;
