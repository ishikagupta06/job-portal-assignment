import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Building2, Clock, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { useStore } from '../store';
import { getJob } from '../api/jobs';
import { createApplication, getApplications } from '../api/applications';
import type { Job } from '../types';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const [job, setJob] = useState<Job | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { job: fetchedJob } = await getJob(id);
        setJob(fetchedJob);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load job');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    const checkApplication = async () => {
      if (!id || !currentUser || currentUser.role !== 'jobseeker') return;
      try {
        const { applications } = await getApplications({ jobId: id });
        setHasApplied(applications.some(app => app.userId === currentUser.id));
      } catch {
        // Ignore errors
      }
    };

    checkApplication();
  }, [id, currentUser]);

  const handleApply = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'jobseeker' || !id) return;

    try {
      setApplying(true);
      await createApplication({ jobId: id, coverLetter: '', resume: '' });
      setHasApplied(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className={`text-center py-20 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading job...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className={`text-center py-20 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <h2 className="text-2xl font-bold mb-4">{error || 'Job not found'}</h2>
        <Link to="/jobs" className="text-primary-600 hover:underline">Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <Link
        to="/jobs"
        className={`inline-flex items-center gap-2 mb-6 text-sm font-medium ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </Link>

      <div className={`card ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8 mb-8`}>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-4">
              <span className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {job.company}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {job.location}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {job.type}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${isDarkMode ? 'bg-primary-900/50 text-primary-300' : 'bg-primary-100 text-primary-700'}`}>
                {job.category}
              </span>
            </div>
          </div>
          <div className="lg:text-right shrink-0">
            <div className="text-2xl font-bold text-primary-600 mb-2">{job.salary}</div>
            <div className="flex items-center justify-end gap-2 text-gray-500 mb-4">
              <Clock className="w-5 h-5" />
              Posted {job.postedDate}
            </div>
            {currentUser?.role === 'jobseeker' && (
              hasApplied ? (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle className="w-5 h-5" />
                  Application Submitted
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              )
            )}
            {!currentUser && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Sign in to apply</p>
                <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                  Sign In to Apply
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className={`card ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <p className={`mb-6 whitespace-pre-line ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{job.description}</p>

            <h3 className="text-xl font-bold mb-4">Requirements</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className={`card ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8 sticky top-24`}>
            <h2 className="text-xl font-bold mb-4">Company Overview</h2>
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-4">
                <Building2 className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold">{job.company}</h3>
                <p className="text-gray-500">{job.location}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              Leading technology company specializing in innovative solutions. Join our team and grow with us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;