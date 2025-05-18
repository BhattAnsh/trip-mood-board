import React from 'react';
import { X, Plane, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LandingMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const LandingMobileMenu = ({ isOpen, onClose }: LandingMobileMenuProps) => {
  // Function to handle navigation link clicks - close menu and scroll to section
  const handleNavLinkClick = (sectionId?: string) => {
    onClose();
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-neo-bg z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } md:hidden`}
    >
      <div className="h-full flex flex-col p-6">
        {/* Header with logo and close button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="shadow-neo-flat w-10 h-10 rounded-xl flex items-center justify-center bg-mood-color-10">
              <Plane size={20} className="text-mood-color" />
            </div>
            <h1 className="text-xl font-bold text-mood-color">Trip Canvas</h1>
          </div>
          <button
            className="shadow-neo-flat w-10 h-10 rounded-lg flex items-center justify-center text-mood-color"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation links */}
        <div className="flex flex-col gap-6 py-4">
          <a 
            href="#features" 
            className="text-xl text-neo-text hover:text-mood-color transition-colors py-2 border-b border-mood-color-10/20"
            onClick={() => handleNavLinkClick('features')}
          >
            Features
          </a>
          <a 
            href="#about" 
            className="text-xl text-neo-text hover:text-mood-color transition-colors py-2 border-b border-mood-color-10/20"
            onClick={() => handleNavLinkClick('about')}
          >
            About
          </a>
          <a 
            href="#testimonials" 
            className="text-xl text-neo-text hover:text-mood-color transition-colors py-2 border-b border-mood-color-10/20"
            onClick={() => handleNavLinkClick('testimonials')}
          >
            Testimonials
          </a>
        </div>
        
        {/* Get Started button at the bottom */}
        <div className="mt-auto">
          <Link 
            to="/app/trips" 
            className="w-full neo-button bg-mood-color text-white font-medium flex items-center justify-center gap-2 py-3"
            onClick={onClose}
          >
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingMobileMenu; 