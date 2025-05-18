import React, { useEffect, useState } from 'react';
import { useTrip } from '../hooks/use-trip';
import TimeSlider from '../components/TimeSlider';
import TimeSliderMobile from '../components/TimeSliderMobile';
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
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../components/ui/resizable";

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
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  
  // Update viewport width on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Calculate appropriate panel size based on viewport with better clamping values
  const getPanelHeight = () => {
    if (viewportWidth < 640) { // Small mobile
      return 'clamp(170px, 45vh, 240px)';  // Increased minimum for better interaction
    } else if (viewportWidth < 768) { // Mobile/small tablet
      return 'clamp(180px, 40vh, 300px)';  // Better minimum height for usability
    } else if (viewportWidth < 1024) { // Tablet/small desktop
      return 'clamp(200px, 35vh, 340px)';  // Improved for tablets
    } else {
      return 'clamp(220px, 30vh, 420px)'; // Desktop
    }
  };
  
  // Check if the trip radio element exists
  useEffect(() => {
    const checkTripRadioElement = () => {
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
    if (isOpen) {
      setTimeout(checkTripRadioElement, 100);
    }
  }, [isOpen]);
  
  // Determine panel size ratio based on screen size
  const getTimePanelSize = () => {
    return viewportWidth < 640 ? 60 : viewportWidth < 768 ? 65 : 75;
  };
  
  const getSpotifyPanelSize = () => {
    return viewportWidth < 640 ? 40 : viewportWidth < 768 ? 35 : 25;
  };
  
  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 z-20 
        bg-white/90 backdrop-blur-md 
        transition-all duration-300 ease-out transform
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        border-t border-white/30
        shadow-lg
        bottom-panel
        overflow-hidden
      `}
      style={{ 
        boxShadow: isOpen ? '0 -4px 20px rgba(0,0,0,0.15)' : 'none',
        height: getPanelHeight(),
      }}
    >
      <div className="relative w-full h-full flex flex-col">
        {/* Interactive drag handle with better touch area for mobile */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20 cursor-pointer touch-manipulation"
          onClick={onToggle}
          style={{ touchAction: 'none' }}
        >
          <div className="w-20 h-6 bg-white/80 rounded-t-lg border-t border-l border-r border-white/30 flex items-center justify-center">
            <div className="w-10 h-1.5 bg-mood-color/30 rounded-full"></div>
          </div>
        </div>

        <ResizablePanelGroup
          direction="horizontal"
          className="h-full rounded-t-xl overflow-hidden"
        >
          <ResizablePanel 
            defaultSize={getTimePanelSize()} 
            minSize={viewportWidth < 640 ? 45 : viewportWidth < 768 ? 40 : 30}
            className="h-full"
          >
            <div className="h-full p-1 sm:p-2 md:p-3 lg:p-4">
              <div className="h-full shadow-neo-flat rounded-lg sm:rounded-xl bg-white/50 overflow-hidden">
                {/* Conditionally render different TimeSlider components based on screen size */}
                <div className="xs:block sm:hidden h-full">
                  <TimeSliderMobile />
                </div>
                <div className="xs:hidden h-full">
                  <TimeSlider />
                </div>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle 
            withHandle 
            className="bg-mood-color/10 hover:bg-mood-color/20 transition-colors w-1 xs:w-2 sm:w-1 touch-manipulation"
            style={{ touchAction: 'none' }}
          />
          
          <ResizablePanel 
            defaultSize={getSpotifyPanelSize()} 
            minSize={viewportWidth < 640 ? 25 : viewportWidth < 768 ? 30 : 20}
            className="h-full"
          >
            <div className="h-full p-1 sm:p-2 md:p-3 lg:p-4">
              <div className="h-full shadow-neo-flat rounded-lg sm:rounded-xl bg-white/50 overflow-hidden">
                <SpotifyPlayer />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
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
