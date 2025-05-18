import React from 'react';

interface ResponsiveMessageProps {
  children: React.ReactNode;
}

/**
 * Component to display a message for mobile users
 * Only visible on screens smaller than sm breakpoint
 */
export const MobileMessage: React.FC<ResponsiveMessageProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 bg-neo-bg sm:hidden flex flex-col items-center justify-center text-center p-6">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-md shadow-neo-card animate-fade-in border border-white/30">
        <div className="mb-6 bg-white shadow-neo-flat p-4 rounded-full inline-flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mood-color">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
            <path d="M12 11V3"></path>
          </svg>
        </div>
        
        {/* Phone rotation animation */}
        <div className="flex justify-center mb-6">
          <div className="relative w-28 h-28">
            {/* Animation container */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Phone outline with rotation animation */}
              <div className="relative w-16 h-24 rounded-xl border-2 border-mood-color animate-phone-rotate">
                {/* Screen */}
                <div className="absolute inset-1 bg-white/50 rounded-lg"></div>
                {/* Home button */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-mood-color/70"></div>
                {/* Camera */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-mood-color/70"></div>
                {/* Content illustration */}
                <div className="absolute inset-3 flex flex-col space-y-1">
                  <div className="h-1 w-full bg-mood-color/30 rounded"></div>
                  <div className="h-1 w-3/4 bg-mood-color/30 rounded"></div>
                  <div className="h-1 w-full bg-mood-color/30 rounded"></div>
                  <div className="h-1 w-1/2 bg-mood-color/30 rounded"></div>
                </div>
              </div>
              
              {/* Rotation arrow */}
              <div className="absolute -right-1 -top-1 w-8 h-8 animate-arrow-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mood-color">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                  <path d="M16 21h5v-5"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 text-neo-text">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Component to display content only on tablet and larger screens
 */
export const TabletAndAbove: React.FC<ResponsiveMessageProps> = ({ children }) => {
  return (
    <div className="hidden sm:block">
      {children}
    </div>
  );
};

/**
 * Component to display content only on mobile screens
 */
export const MobileOnly: React.FC<ResponsiveMessageProps> = ({ children }) => {
  return (
    <div className="block sm:hidden">
      {children}
    </div>
  );
};

export default { MobileMessage, TabletAndAbove, MobileOnly }; 