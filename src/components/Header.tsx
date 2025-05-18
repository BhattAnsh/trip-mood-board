import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTrip } from '../hooks/use-trip';
import { useTheme } from '../hooks/use-theme';
import { Home, Compass, Settings, ArrowLeft, Plane, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTrip } = useTrip();
  const { getMoodColorHex } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Consider landing page, trips page, and settings page for the full header style
  const isLandingPage = location.pathname === '/' || location.pathname === '/app/trips' || location.pathname === '/settings';
  
  // Track scroll position to conditionally apply shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <>
      <header className={`${isLandingPage ? `py-4 px-4 sm:py-5 sm:px-6 md:px-10 flex justify-between items-center sticky top-0 z-50 bg-neo-bg bg-opacity-95 backdrop-blur-sm transition-shadow duration-300 ${isScrolled ? 'shadow-neo-flat' : ''}` : 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3'}`}>
        {isLandingPage ? (
          // Landing page header
          <>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="shadow-neo-flat w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-mood-color-10">
                <Plane size={18} className="text-mood-color sm:text-20" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-mood-color">Trip Canvas Vibes</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {location.pathname === '/' ? (
                <>
                  <a href="#features" className="text-neo-text hover:text-mood-color transition-colors">Features</a>
                  <a href="#about" className="text-neo-text hover:text-mood-color transition-colors">About</a>
                  <a href="#testimonials" className="text-neo-text hover:text-mood-color transition-colors">Testimonials</a>
                </>
              ) : location.pathname === '/settings' ? (
                <>
                  <Link to="/" className="text-neo-text hover:text-mood-color transition-colors">Home</Link>
                  <Link to="/app/trips" className="text-neo-text hover:text-mood-color transition-colors">My Trips</Link>
                </>
              ) : (
                <>
                  <Link to="/" className="text-neo-text hover:text-mood-color transition-colors">Home</Link>
                  <Link to="/settings" className="text-neo-text hover:text-mood-color transition-colors">Settings</Link>
                </>
              )}
            </div>
            
            <div className="flex gap-3 sm:gap-4 items-center">
              {location.pathname === '/' ? (
                <Link to="/app/trips" className="hidden sm:flex neo-button text-mood-color bg-mood-color-10 hover:bg-mood-color-20 transition-all duration-300 px-3 sm:px-4 py-2">
                  Get Started
                </Link>
              ) : location.pathname === '/app/trips' ? (
                <Link to="/" className="hidden sm:flex neo-button text-mood-color bg-mood-color-10 hover:bg-mood-color-20 transition-all duration-300 px-3 sm:px-4 py-2">
                  Home
                </Link>
              ) : (
                <button onClick={() => navigate(-1)} className="hidden sm:flex neo-button text-mood-color bg-mood-color-10 hover:bg-mood-color-20 transition-all duration-300 px-3 sm:px-4 py-2">
                  Back
                </button>
              )}
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden shadow-neo-flat w-9 h-9 rounded-lg flex items-center justify-center bg-mood-color-10 text-mood-color"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </>
        ) : (
          // App header
          <>
            {/* Left toolbar */}
            <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-xl flex items-center overflow-hidden border border-white/30">
              {/* Logo in toolbar */}
              <Link 
                to="/" 
                className="flex items-center gap-2 px-3 py-2 hover:bg-mood-color-10 transition-colors"
              >
                <div className="shadow-neo-flat w-7 h-7 rounded-lg flex items-center justify-center bg-mood-color-10">
                  <Plane size={14} className="text-mood-color" />
                </div>
                <h1 className="text-sm font-bold text-mood-color">Trip Canvas</h1>
              </Link>
              
              {/* Divider */}
              <div className="h-6 w-px bg-gray-200/70 mx-1"></div>
              
              {/* Navigation toolbar */}
              <nav className="flex items-center">
                <button
                  onClick={() => navigate('/')}
                  className="p-2 hover:bg-mood-color-10 text-mood-color transition-colors relative group"
                  title="Home"
                >
                  <Home size={16} />
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-black text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity shadow-lg">Home</span>
                </button>
                <button
                  onClick={() => navigate('/app/trips')}
                  className="p-2 hover:bg-mood-color-10 text-mood-color transition-colors relative group"
                  title="My Trips"
                >
                  <Compass size={16} />
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-black text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity shadow-lg">My Trips</span>
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="p-2 hover:bg-mood-color-10 text-mood-color transition-colors relative group"
                  title="Settings"
                >
                  <Settings size={16} />
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-black text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity shadow-lg">Settings</span>
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-mood-color-10 text-mood-color transition-colors relative group"
                  title="Go Back"
                >
                  <ArrowLeft size={16} />
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-black text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity shadow-lg">Back</span>
                </button>
              </nav>
            </div>
            
            {/* Page context - only when a trip is selected */}
            {currentTrip && (
              <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-xl px-3 py-2 flex items-center border border-white/30">
                <span className="text-sm font-medium text-mood-color">{currentTrip.title}</span>
              </div>
            )}
          </>
        )}
      </header>

      {/* Mobile Navigation Menu */}
      {isLandingPage && (
        <div className={`fixed inset-0 bg-neo-bg z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
          <div className="h-full flex flex-col p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="shadow-neo-flat w-10 h-10 rounded-xl flex items-center justify-center bg-mood-color-10">
                  <Plane size={20} className="text-mood-color" />
                </div>
                <h1 className="text-xl font-bold text-mood-color">Trip Canvas Vibes</h1>
              </div>
              <button
                className="shadow-neo-flat w-10 h-10 rounded-lg flex items-center justify-center text-mood-color"
                onClick={toggleMobileMenu}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-6 py-4">
              {location.pathname === '/' ? (
                <>
                  <a 
                    href="#features" 
                    className="text-xl text-neo-text hover:text-mood-color transition-colors py-2 border-b border-mood-color-10/20"
                    onClick={handleNavLinkClick}
                  >
                    Features
                  </a>
                  <a 
                    href="#about" 
                    className="text-xl text-neo-text hover:text-mood-color transition-colors py-2 border-b border-mood-color-10/20"
                    onClick={handleNavLinkClick}
                  >
                    About
                  </a>
                  <a 
                    href="#testimonials" 
                    className="text-xl text-neo-text hover:text-mood-color transition-colors py-2 border-b border-mood-color-10/20"
                    onClick={handleNavLinkClick}
                  >
                    Testimonials
                  </a>
                </>
              ) : location.pathname === '/settings' ? (
                <>
                  <Link
                    to="/"
                    className="text-xl text-neo-text hover:text-mood-color transition-colors py-2 border-b border-mood-color-10/20"
                    onClick={handleNavLinkClick}
                  >
                    Home
                  </Link>
                  <Link
                    to="/app/trips"
                    className="text-xl text-neo-text hover:text-mood-color transition-colors py-2 border-b border-mood-color-10/20"
                    onClick={handleNavLinkClick}
                  >
                    My Trips
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="text-xl text-neo-text hover:text-mood-color transition-colors py-2 border-b border-mood-color-10/20"
                    onClick={handleNavLinkClick}
                  >
                    Home
                  </Link>
                  <Link
                    to="/settings"
                    className="text-xl text-neo-text hover:text-mood-color transition-colors py-2 border-b border-mood-color-10/20"
                    onClick={handleNavLinkClick}
                  >
                    Settings
                  </Link>
                </>
              )}
            </div>
            
            <div className="mt-auto">
              {location.pathname === '/' ? (
                <Link 
                  to="/app/trips" 
                  className="w-full neo-button bg-mood-color text-white font-medium flex items-center justify-center gap-2 py-3"
                  onClick={handleNavLinkClick}
                >
                  Get Started <ArrowRight size={18} />
                </Link>
              ) : location.pathname === '/app/trips' ? (
                <Link 
                  to="/settings" 
                  className="w-full neo-button bg-mood-color text-white font-medium flex items-center justify-center gap-2 py-3"
                  onClick={handleNavLinkClick}
                >
                  Settings <Settings size={18} />
                </Link>
              ) : (
                <button
                  onClick={() => {
                    navigate(-1);
                    handleNavLinkClick();
                  }}
                  className="w-full neo-button bg-mood-color text-white font-medium flex items-center justify-center gap-2 py-3"
                >
                  Back <ArrowLeft size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header; 