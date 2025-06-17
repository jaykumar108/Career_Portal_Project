import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen); 
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const navbarClasses = `fixed top-0 z-50 w-full transition-all duration-300 ${
    isScrolled 
      ? 'bg-white/95 backdrop-blur-md shadow-lg' 
      : 'bg-white/80 backdrop-blur-sm'
  }`;

  return (
    <header className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <img 
                  src="/logo.jpg" 
                  alt="Career Portal Logo" 
                  className="h-10 w-10 object-contain"
                />
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CareerPortal
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 ${
                location.pathname === '/' ? 'text-blue-600' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/jobs" 
              className={`text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 ${
                location.pathname === '/jobs' ? 'text-blue-600' : ''
              }`}
            >
              Jobs
            </Link>
            
            {user ? (
              <div className="relative ml-3">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200"
                >
                  <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm">{user.name}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 ring-1 ring-black ring-opacity-5 animate-fadeIn">
                    {user.isAdmin ? (
                      <>
                        <Link to="/admin/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                          <span className="ml-2">Dashboard</span>
                        </Link>
                        <Link to="/admin/jobs" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                          <span className="ml-2">Manage Jobs</span>
                        </Link>
                        <Link to="/admin/applications" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                          <span className="ml-2">Manage Applications</span>
                        </Link>
                        <hr className="my-2 border-gray-100" />
                      </>
                    ) : (
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                        <span className="ml-2">My Profile</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg overflow-hidden transition-all duration-300 animate-slideDown">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`flex items-center px-3 py-2.5 rounded-lg text-base font-medium transition-colors duration-200 ${
                location.pathname === '/' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex-1">Home</span>
              {location.pathname === '/' && (
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
              )}
            </Link>
            <Link
              to="/jobs"
              className={`flex items-center px-3 py-2.5 rounded-lg text-base font-medium transition-colors duration-200 ${
                location.pathname === '/jobs' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              
              <span className="flex-1">Jobs</span>
              {location.pathname === '/jobs' && (
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
              )}
            </Link>
            
            {user ? (
              <>
                {user.isAdmin ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <span className="flex-1">Dashboard</span>
                    </Link>
                    <Link
                      to="/admin/jobs"
                      className="flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <span className="flex-1">Manage Jobs</span>
                    </Link>
                    <Link
                      to="/admin/applications"
                      className="flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <span className="flex-1">Manage Applications</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <span className="flex-1">My Profile</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span className="flex-1 text-left">Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span className="flex-1">Log In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center px-3 py-2.5 mt-1 rounded-lg text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg"
                >
                  <span className="flex-1 text-center">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;