import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTrip } from '../hooks/use-trip';
import { useTheme } from '../hooks/use-theme';
import { Home, Compass, Settings, ArrowLeft, Plane, Menu } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const { currentTrip } = useTrip();
  const { getMoodColorHex } = useTheme();
  
  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3">
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
    </header>
  );
};

export default Header; 