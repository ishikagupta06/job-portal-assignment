import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Briefcase, LayoutDashboard, Plus } from 'lucide-react';
import { useStore } from '../store';

function Navbar() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode, currentUser, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
    isDarkMode
      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
      : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
  }`;

  return (
    <nav className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className={`flex items-center gap-2 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} hover:opacity-90 transition`}
          >
            <Briefcase className="w-7 h-7 text-primary-500" />
            JobPortal
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/jobs" className={navLinkClass}>
              <Briefcase className="w-4 h-4" />
              Jobs
            </Link>

            {currentUser ? (
              <>
                {currentUser.role === 'employer' && (
                  <Link to="/employer/jobs/create" className={navLinkClass}>
                    <Plus className="w-4 h-4" />
                    Post Job
                  </Link>
                )}
                <Link to={`/${currentUser.role}/dashboard`} className={navLinkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className={`flex items-center gap-2 ml-2 pl-4 border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {currentUser.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isDarkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-red-400' : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={navLinkClass}>
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`ml-2 px-4 py-2 rounded-lg font-medium bg-primary-600 text-white hover:bg-primary-700 transition`}
                >
                  Sign Up
                </Link>
              </>
            )}

            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-lg ml-2 transition ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-amber-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;