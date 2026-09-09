import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  InformationCircleIcon,
  CalendarIcon,
  BookOpenIcon,
  SpeakerWaveIcon,
  HeartIcon,
  EnvelopeIcon,
  PlusCircleIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  // Updated navLinks - removed 'Sermons' and 'Events'
  const navLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'About', path: '/about', icon: InformationCircleIcon },
    { name: 'Services', path: '/services', icon: BookOpenIcon },
    { name: 'Blog', path: '/blog', icon: DocumentTextIcon },
    { name: 'Donate', path: '/donate', icon: HeartIcon },
    { name: 'Contact', path: '/contact', icon: EnvelopeIcon },
  ];

  // Removed 'What We Do' from navLinks as well

  const memberLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'My Profile', path: '/profile', icon: UserCircleIcon },
    { name: 'My Donations', path: '/my-donations', icon: CurrencyDollarIcon },
    { name: 'Submit Donation', path: '/submit-donation', icon: PlusCircleIcon },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: HomeIcon },
    { name: 'Members', path: '/admin/members', icon: UserGroupIcon },
    { name: 'Donations', path: '/admin/donations', icon: CurrencyDollarIcon },
    { name: 'Content', path: '/admin/content', icon: DocumentTextIcon },
    { name: 'Services', path: '/admin/services', icon: BookOpenIcon },
    { name: 'Reports', path: '/admin/reports', icon: ClipboardDocumentListIcon },
  ];

  return (
    <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">✝</span>
            <span className="font-bold text-lg hidden sm:block">Mehbere Edomias</span>
            <span className="font-bold text-sm sm:hidden">ME</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-300 hover:text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-md transition"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">{user.fullName?.split(' ')[0]}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                    {memberLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <link.icon className="h-5 w-5 mr-2 text-gray-500" />
                        {link.name}
                      </Link>
                    ))}
                    
                    {isAdmin() && (
                      <>
                        <div className="border-t border-gray-200 my-1"></div>
                        {adminLinks.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <link.icon className="h-5 w-5 mr-2 text-gray-500" />
                            {link.name}
                          </Link>
                        ))}
                      </>
                    )}
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gold-500 text-blue-900 hover:bg-gold-400 px-4 py-2 rounded-md text-sm font-semibold transition"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-blue-800 transition"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800 px-4 py-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-700 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <>
              <div className="border-t border-blue-700 my-2"></div>
              {memberLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-700 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin() && (
                <>
                  <div className="border-t border-blue-700 my-2"></div>
                  {adminLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-700 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </>
              )}
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-blue-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-4 space-y-2">
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 rounded-md text-base font-medium bg-blue-700 hover:bg-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block w-full text-center px-4 py-2 rounded-md text-base font-medium bg-gold-500 text-blue-900 hover:bg-gold-400 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Us
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;