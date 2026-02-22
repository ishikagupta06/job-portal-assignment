import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../store';
import { getApplications } from '../api/applications';

const applicationData = [
  { week: 'Week 1', applications: 3 },
  { week: 'Week 2', applications: 5 },
  { week: 'Week 3', applications: 2 },
  { week: 'Week 4', applications: 7 },
  { week: 'Week 5', applications: 4 },
  { week: 'Week 6', applications: 6 },
];

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

function JobSeekerDashboard() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const { applications: fetchedApps } = await getApplications();
        setApplications(fetchedApps.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()));
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

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
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Job Seeker Dashboard</h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Welcome back, {currentUser?.name}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <div className={`card p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Applications</h3>
          <p className="text-3xl font-bold text-primary-600">{applications.length}</p>
        </div>
        <div className={`card p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Under Review</h3>
          <p className="text-3xl font-bold text-amber-500">{applications.filter(a => a.status === 'pending').length}</p>
        </div>
        <div className={`card p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Accepted</h3>
          <p className="text-3xl font-bold text-green-600">{applications.filter(a => a.status === 'accepted').length}</p>
        </div>
        <div className={`card p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">{applications.filter(a => a.status === 'rejected').length}</p>
        </div>
      </div>

      <div className={`card p-6 mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold mb-4">Application Activity</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={applicationData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="week" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`card overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold p-6 border-b border-gray-200 dark:border-gray-700">Application History</h2>
        <div className="overflow-x-auto">
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>You haven't applied to any jobs yet.</p>
              <Link to="/jobs" className="btn-primary inline-block">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Job Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Applied Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className={`border-t ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <Link to={`/jobs/${app.jobId}`} className="font-medium text-primary-600 hover:underline">
                        {app.job?.title ?? 'Unknown Job'}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{app.job?.company ?? 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-500">{app.appliedDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[app.status] ?? ''}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
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

export default JobSeekerDashboard;