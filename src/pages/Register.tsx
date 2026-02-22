import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Building2 } from 'lucide-react';
import { useStore, setAuth } from '../store';
import { register } from '../api/auth';

function Register() {
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'jobseeker' as 'jobseeker' | 'employer',
    company: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user, token } = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        company: formData.role === 'employer' ? formData.company : undefined,
      });
      setAuth(user, token);
      setSuccess(true);
      setTimeout(() => navigate(`/${formData.role}/dashboard`), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className={`card ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
        <p className={`text-center mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Join JobPortal and get started
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
            Account created! Redirecting to your dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className={`input-field pl-11 ${isDarkMode ? 'bg-gray-700' : ''}`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className={`input-field pl-11 ${isDarkMode ? 'bg-gray-700' : ''}`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className={`input-field pl-11 ${isDarkMode ? 'bg-gray-700' : ''}`}
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Account Type</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'jobseeker' | 'employer' })}
              className={`input-field ${isDarkMode ? 'bg-gray-700' : ''}`}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {formData.role === 'employer' && (
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <div className="relative">
                <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Your Company Inc."
                  className={`input-field pl-11 ${isDarkMode ? 'bg-gray-700' : ''}`}
                  required={formData.role === 'employer'}
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={success || loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;