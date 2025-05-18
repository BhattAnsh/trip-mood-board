import React, { useEffect, useState } from 'react';
import { useTrip } from '../hooks/use-trip';
import TimeSlider from '../components/TimeSlider';
import StickerLibrary from '../components/StickerLibrary';
import MemoryCanvas from '../components/MemoryCanvas';
import SpotifyPlayer from '../components/SpotifyPlayer';
import { useTheme } from '../hooks/use-theme';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarProvider, 
  SidebarTrigger, 
  SidebarFooter 
} from "@/components/ui/sidebar";
import { MapPin, Plane, Compass, Camera, PanelLeftClose, PlusCircle, ChevronLeft, ChevronRight, Music, RotateCcw } from 'lucide-react';
import Header from "../components/Header";
import { MobileMessage } from "../components/ResponsiveMessage";

const TripDashboard = ({ 
  toggleRightPanel, 
  toggleBottomPanel,
  isRightPanelOpen,
  isBottomPanelOpen 
}: { 
  toggleRightPanel: () => void, 
  toggleBottomPanel: () => void,
  isRightPanelOpen: boolean,
  isBottomPanelOpen: boolean
}) => {
  const { currentTrip } = useTrip();
  const { getMoodColorHex } = useTheme();
  const navigate = useNavigate();

  // Redirect to trips page if no trip is selected
  useEffect(() => {
    if (!currentTrip) {
      navigate('/app/trips');
    }
  }, [currentTrip, navigate]);

  if (!currentTrip) return null; // Return null during redirect

  return (
    <div className="h-full">
      <MemoryCanvas 
        toggleRightPanel={toggleRightPanel}
        toggleBottomPanel={toggleBottomPanel}
        isRightPanelOpen={isRightPanelOpen}
        isBottomPanelOpen={isBottomPanelOpen}
      />
    </div>
  );
};

const RightPanel = ({ isOpen, onToggle }: { isOpen: boolean, onToggle: () => void }) => {
  return (
    <div 
      className={`fixed right-0 top-0 bottom-0 z-20 bg-white/90 backdrop-blur-md transform transition-all duration-300 ease-out right-panel ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      style={{
        width: 'clamp(280px, 30vw, 450px)', // Responsive width: min 280px, preferred 30vw, max 450px
        boxShadow: isOpen ? '-4px 0 20px rgba(0,0,0,0.15)' : 'none',
        borderLeft: '1px solid rgba(255,255,255,0.3)'
      }}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Mobile message for very small screens */}
        <div className="lg:hidden md:hidden sm:block xs:block mb-4 p-4 bg-neo-bg rounded-lg shadow-neo-inset">
          <div className="flex items-center gap-3">
            <div className="bg-mood-color/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mood-color">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M12 11V3"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-mood-color">Better on larger screens</h3>
              <p className="text-xs text-neo-text mt-1">This experience is optimized for desktop and tablets</p>
            </div>
          </div>
        </div>
        
        <StickerLibrary />
      </div>
    </div>
  );
};

const BottomPanel = ({ isOpen, onToggle }: { isOpen: boolean, onToggle: () => void }) => {
  const [isTripRadioVisible, setIsTripRadioVisible] = useState(true);
  
  // Check if the trip radio element exists
  useEffect(() => {
    const checkTripRadioElement = () => {
      // Look for elements that might contain the Trip Radio text
      const elements = document.querySelectorAll('.text-mood-color');
      let found = false;
      
      elements.forEach(element => {
        if (element.textContent?.includes('Trip Radio')) {
          found = true;
        }
      });
      
      setIsTripRadioVisible(found);
    };
    
    checkTripRadioElement();
    // Re-check when the panel is opened
    if (isOpen) {
      setTimeout(checkTripRadioElement, 100);
    }
  }, [isOpen]);
  
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md transition-all duration-300 ease-out transform bottom-panel ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ 
        height: isOpen ? 'clamp(300px, 50vh, 500px)' : '0', // Responsive height: 50vh on small screens, with min/max constraints
        boxShadow: isOpen ? '0 -4px 20px rgba(0,0,0,0.15)' : 'none',
        borderTop: '1px solid rgba(255,255,255,0.3)'
      }}
    >
      <div className="grid grid-cols-[3fr_1fr] gap-4 p-4 h-full text-sm md:text-base">
        {/* Timeline with responsive text via tailwind classes */}
        <div className="overflow-hidden shadow-neo-flat rounded-xl bg-white/50">
          <div className="text-sm md:text-base">
            <TimeSlider />
          </div>
        </div>
        
        {/* Spotify Player with responsive text via tailwind classes */}
        <div className="overflow-hidden shadow-neo-flat rounded-xl bg-white/50">
          <div className="text-sm md:text-base">
            <SpotifyPlayer />
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [rightPanelOpen, setRightPanelOpen] = React.useState(false);
  const [bottomPanelOpen, setBottomPanelOpen] = React.useState(false);
  const location = useLocation();
  
  // Check if current page is the canvas page
  const isCanvasPage = location.pathname.includes('/app/canvas') || location.pathname === '/app';

  const toggleRightPanel = () => setRightPanelOpen(!rightPanelOpen);
  const toggleBottomPanel = () => setBottomPanelOpen(!bottomPanelOpen);

  // Add global click handler to close panels when clicking outside
  React.useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Check if we're clicking outside the panels
      const rightPanelElement = document.querySelector('.right-panel');
      const bottomPanelElement = document.querySelector('.bottom-panel');
      const isRightPanelClick = rightPanelElement && rightPanelElement.contains(e.target as Node);
      const isBottomPanelClick = bottomPanelElement && bottomPanelElement.contains(e.target as Node);
      
      // Also ignore clicks on the panel toggle buttons
      const target = e.target as HTMLElement;
      const isPanelToggleButton = target.closest('button')?.getAttribute('title')?.includes('Bar');
      
      if (!isRightPanelClick && !isBottomPanelClick && !isPanelToggleButton) {
        if (rightPanelOpen) {
          setRightPanelOpen(false);
        }
        if (bottomPanelOpen) {
          setBottomPanelOpen(false);
        }
      }
    };

    // Only add the listener if one of the panels is open
    if (rightPanelOpen || bottomPanelOpen) {
      document.addEventListener('mousedown', handleGlobalClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, [rightPanelOpen, bottomPanelOpen]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-neo-bg relative">
      {/* Mobile message for very small screens */}
      <MobileMessage>
        <h2 className="text-xl font-semibold mb-2 text-mood-color">Trip Canvas Vibes</h2>
        <p className="text-neo-text mb-6">This application is designed for larger screens. Please use a tablet or desktop for the best experience.</p>
        <div className="flex justify-center">
          <button 
            className="neo-button bg-white shadow-neo-card hover:shadow-neo-card-hover active:shadow-neo-btn-pressed py-2.5 px-5 rounded-lg flex items-center gap-2 text-mood-color transition-all duration-200"
            onClick={() => {
              // Try to enter fullscreen or rotate to landscape
              if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
              }
            }}
          >
            <RotateCcw size={16} />
            <span>Try Landscape Mode</span>
          </button>
        </div>
      </MobileMessage>
      
      {/* Main Canvas - Fullscreen */}
      <div className="absolute inset-0">
        <TripDashboard 
          toggleRightPanel={toggleRightPanel}
          toggleBottomPanel={toggleBottomPanel}
          isRightPanelOpen={rightPanelOpen}
          isBottomPanelOpen={bottomPanelOpen}
        />
      </div>
      
      {/* Floating Header - don't show on canvas page */}
      {!isCanvasPage && <Header />}
      
      {/* Side Panels */}
      <RightPanel isOpen={rightPanelOpen} onToggle={toggleRightPanel} />
      <BottomPanel isOpen={bottomPanelOpen} onToggle={toggleBottomPanel} />
    </div>
  );
};

export default Index;
