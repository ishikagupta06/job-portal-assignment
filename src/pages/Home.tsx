import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Search, Building2, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../store';

function Home() {
  const isDarkMode = useStore((state) => state.isDarkMode);

  return (
    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 -z-10 ${isDarkMode ? 'bg-gradient-to-br from-primary-900/20 to-gray-900' : 'bg-gradient-to-br from-primary-50 to-gray-100'}`} />
        <div className="text-center py-20 md:py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Your next opportunity awaits
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
            Find Your <span className="text-primary-600">Dream Job</span> Today
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and aspirations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/jobs" className="btn-primary inline-flex items-center justify-center gap-2">
              Browse Jobs
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/register" className="btn-secondary inline-flex items-center justify-center gap-2">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <h2 className="text-2xl font-bold text-center mb-12">Why Choose JobPortal?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className={`card p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
              <Search className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Search Jobs</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Browse through thousands of job listings from top companies. Filter by category, location, and more.
            </p>
          </div>

          <div className={`card p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
              <Briefcase className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Apply</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Apply to multiple jobs with just a few clicks using your profile. Track your applications in one place.
            </p>
          </div>

          <div className={`card p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
              <Building2 className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Company Profiles</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Learn about company culture and benefits before applying. Make informed decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;