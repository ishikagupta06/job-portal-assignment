import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { useStore } from '../store';
import { getJob, updateJob } from '../api/jobs';
import type { Job } from '../types';

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    category: 'Development',
    requirements: [''],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        setFetching(true);
        const { job } = await getJob(id);
        setFormData({
          title: job.title,
          location: job.location,
          type: job.type,
          salary: job.salary,
          description: job.description,
          category: job.category,
          requirements: job.requirements.length > 0 ? job.requirements : [''],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load job');
      } finally {
        setFetching(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const requirements = formData.requirements.filter(r => r.trim());
    if (requirements.length === 0) {
      setError('At least one requirement is needed');
      setLoading(false);
      return;
    }

    try {
      await updateJob(id!, {
        ...formData,
        requirements,
      });
      navigate('/employer/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ''] });
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...formData.requirements];
    updated[index] = value;
    setFormData({ ...formData, requirements: updated });
  };

  const removeRequirement = (index: number) => {
    const updated = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: updated.length > 0 ? updated : [''] });
  };

  if (fetching) {
    return (
      <div className={`text-center py-20 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading job...</p>
      </div>
    );
  }

  if (currentUser?.role !== 'employer') {
    return (
      <div className={`text-center py-20 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Only employers can edit jobs.</p>
      </div>
    );
  }

  return (
    <div className={`max-w-3xl mx-auto ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-8">Edit Job Posting</h1>

      <form onSubmit={handleSubmit} className={`card p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Job Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`input-field ${isDarkMode ? 'bg-gray-700' : ''}`}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={`input-field ${isDarkMode ? 'bg-gray-700' : ''}`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Job Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className={`input-field ${isDarkMode ? 'bg-gray-700' : ''}`}
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Salary *</label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className={`input-field ${isDarkMode ? 'bg-gray-700' : ''}`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`input-field ${isDarkMode ? 'bg-gray-700' : ''}`}
                required
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`input-field min-h-[150px] ${isDarkMode ? 'bg-gray-700' : ''}`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Requirements *</label>
            <div className="space-y-2">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    className={`input-field flex-1 ${isDarkMode ? 'bg-gray-700' : ''}`}
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRequirement}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Requirement
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Updating...' : 'Update Job Posting'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/employer/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditJob;
