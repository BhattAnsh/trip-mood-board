import React, { useState } from 'react';
import { Menu, Plane } from 'lucide-react';
import Sidebar from './Sidebar';
import LandingMobileMenu from './LandingMobileMenu';

interface HeaderProps {
  tripName?: string;
  isLanding?: boolean;
}

const Header = ({ tripName, isLanding = false }: HeaderProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Use appropriate mobile menu component based on page type */}
      {isLanding ? (
        <LandingMobileMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      ) : (
        <Sidebar tripName={tripName} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      
      {/* Header */}
      <header className="fixed top-0 z-40 w-full py-3 px-4 bg-neo-bg bg-opacity-95 backdrop-blur-sm shadow-neo-flat">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left section with toggle and logo */}
          <div className="flex items-center gap-3">
            {/* Sidebar toggle - only shown on mobile for non-landing pages */}
            {!isLanding && (
              <button 
                className="shadow-neo-flat w-9 h-9 rounded-lg flex items-center justify-center bg-mood-color-10 text-mood-color md:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Toggle sidebar"
              >
                <Menu size={18} />
              </button>
            )}
            
            {/* Logo and title */}
            <div className="flex items-center gap-2">
              <div className="shadow-neo-flat w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-mood-color-10">
                <Plane size={16} className="text-mood-color" />
              </div>
              <h1 className="text-sm sm:text-lg font-bold text-mood-color">Trip Canvas</h1>
            </div>
          </div>
          
          {/* Trip name badge (only shown if tripName is provided) */}
          {tripName && (
            <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-neo-card rounded-xl px-3 py-2 border border-white/30">
              <span className="text-xs sm:text-sm font-medium text-mood-color">{tripName}</span>
            </div>
          )}
          
          {/* Landing page navigation - only shown if isLanding is true */}
          {isLanding && (
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-neo-text hover:text-mood-color transition-colors">Features</a>
              <a href="#about" className="text-neo-text hover:text-mood-color transition-colors">About</a>
              <a href="#testimonials" className="text-neo-text hover:text-mood-color transition-colors">Testimonials</a>
              <a href="/app/trips" className="neo-button text-mood-color bg-mood-color-10 hover:bg-mood-color-20 transition-all duration-300 px-4 py-2">
                Get Started
              </a>
            </div>
          )}
          
          {/* Mobile menu button for landing page */}
          {isLanding && (
            <button 
              className="md:hidden shadow-neo-flat w-9 h-9 rounded-lg flex items-center justify-center bg-mood-color-10 text-mood-color"
              onClick={() => setSidebarOpen(true)}
              aria-label="Toggle menu"
            >
              <Menu size={18} />
            </button>
          )}
        </div>
      </header>
    </>
  );
};

export default Header; 