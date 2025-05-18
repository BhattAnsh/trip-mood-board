import React, { useState } from 'react';
import { X, Home, Compass, Settings, ArrowLeft, Plane } from 'lucide-react';

interface SidebarProps {
  tripName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ tripName = "My Trip", isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar content */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-neo-bg shadow-neo-card z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:w-56 md:h-screen`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Close button - only on mobile */}
          <button 
            className="self-end p-2 shadow-neo-flat rounded-lg text-mood-color md:hidden"
            onClick={onClose}
          >
            <X size={18} />
          </button>
          
          {/* Logo and title */}
          <div className="flex items-center gap-3 mb-8 mt-2">
            <div className="shadow-neo-flat w-10 h-10 rounded-xl flex items-center justify-center bg-mood-color-10">
              <Plane size={20} className="text-mood-color" />
            </div>
            <h1 className="text-lg font-bold text-mood-color">Trip Canvas</h1>
          </div>
          
          {/* Trip name if provided */}
          {tripName && (
            <div className="mb-6 px-3 py-2 shadow-neo-flat rounded-lg bg-mood-color-10/30">
              <span className="text-sm font-medium text-mood-color">{tripName}</span>
            </div>
          )}
          
          {/* Navigation links */}
          <nav className="space-y-2">
            <a href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-mood-color-10 text-mood-color transition-colors">
              <Home size={18} />
              <span>Home</span>
            </a>
            <a href="/app/trips" className="flex items-center gap-3 p-3 rounded-lg hover:bg-mood-color-10 text-mood-color transition-colors">
              <Compass size={18} />
              <span>My Trips</span>
            </a>
            <a href="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-mood-color-10 text-mood-color transition-colors">
              <Settings size={18} />
              <span>Settings</span>
            </a>
          </nav>
          
          {/* Back button */}
          <div className="mt-auto">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-mood-color-10 text-mood-color transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 