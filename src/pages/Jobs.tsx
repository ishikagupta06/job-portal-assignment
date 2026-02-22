import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, Clock, Briefcase, Filter } from 'lucide-react';
import { useStore } from '../store';
import { getJobs } from '../api/jobs';
import type { Job } from '../types';

function Jobs() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const { jobs: fetchedJobs } = await getJobs({
          search: searchTerm || undefined,
          category: selectedCategory || undefined,
        });
        setJobs(fetchedJobs);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchJobs, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  const categories = [...new Set(jobs.map(job => job.category))];

  return (
    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Next Opportunity</h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {loading ? 'Loading...' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} available`}
        </p>

        <div className={`flex flex-col md:flex-row gap-4 mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-soft`}>
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`input-field pl-12 ${isDarkMode ? 'bg-gray-700' : ''}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`input-field md:min-w-[200px] ${isDarkMode ? 'bg-gray-700' : ''}`}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6`}>
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {loading ? (
          <div className={`text-center py-16 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-soft`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className={`text-center py-16 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-soft`}>
            <Briefcase className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          jobs.map(job => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className={`card block p-6 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 hover:text-primary-600 transition">{job.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {job.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-primary-900/50 text-primary-300' : 'bg-primary-100 text-primary-700'}`}>
                      {job.category}
                    </span>
                  </div>
                </div>
                <div className="md:text-right shrink-0">
                  <div className="text-lg font-semibold text-primary-600">{job.salary}</div>
                  <div className="flex items-center justify-end gap-1 text-sm text-gray-500 mt-2">
                    <Clock className="w-4 h-4" />
                    Posted {job.postedDate}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Jobs;