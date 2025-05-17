import React, { useEffect } from 'react';
import { useTrip } from '../hooks/use-trip';
import TimeSlider from '../components/TimeSlider';
import StickerLibrary from '../components/StickerLibrary';
import MemoryCanvas from '../components/MemoryCanvas';
import SpotifyPlayer from '../components/SpotifyPlayer';
import { useTheme } from '../hooks/use-theme';
import { useIsMobile } from '../hooks/use-mobile';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarProvider, 
  SidebarTrigger, 
  SidebarFooter 
} from "@/components/ui/sidebar";
import { MapPin, Plane, Compass, Camera, PanelLeftClose, PlusCircle } from 'lucide-react';

const TripDashboard = () => {
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
    <div className="h-full flex flex-col">
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-mood-color">
            {currentTrip.title}
          </h2>
          <Link 
            to="/app/trips"
            className="text-sm text-mood-color hover:underline flex items-center"
          >
            <span>Manage Trips</span>
          </Link>
        </div>
      </div>
      <div className="flex-1 h-[calc(100%-50px)]">
        <MemoryCanvas />
      </div>
    </div>
  );
};

const RightPanel = () => {
  const isMobile = useIsMobile();
  
  // Hide the sticker library on mobile
  if (isMobile) return null;
  
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Sticker library */}
      <div className="shadow-neo-card rounded-xl bg-neo-bg overflow-hidden transition-all duration-200 hover:shadow-neo-card-hover flex-1">
        <div className="p-3 h-full">
          <StickerLibrary />
        </div>
      </div>
    </div>
  );
};

const BottomPanel = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-[3fr_1fr] gap-4'}`}>
      {/* Timeline with reduced size - hide on mobile */}
      {!isMobile && (
        <div className="shadow-neo-card rounded-xl bg-neo-bg overflow-hidden transition-all duration-200 hover:shadow-neo-card-hover">
          <TimeSlider />
        </div>
      )}
      
      {/* Spotify Player - always show */}
      <div className={`shadow-neo-card rounded-xl bg-neo-bg overflow-hidden transition-all duration-200 hover:shadow-neo-card-hover ${isMobile ? 'col-span-1' : ''}`}>
        <SpotifyPlayer />
      </div>
    </div>
  );
};

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-neo-bg p-4 md:p-6">
      <div className="shadow-neo-card rounded-xl bg-neo-bg overflow-hidden transition-all duration-200 hover:shadow-neo-card-hover h-[calc(100vh-48px)]">
        <div className="grid grid-rows-[1fr_auto] h-full">
          <div className={`grid ${isMobile ? 'grid-rows-[1fr]' : 'grid-cols-[minmax(0,3fr)_minmax(300px,1fr)]'} h-full`}>
            {/* Main canvas area */}
            <div className="p-4 overflow-auto w-full h-full" style={{ zIndex: 0 }}>
              <TripDashboard />
            </div>
            {/* Right panel with stickers - only on desktop */}
            {!isMobile && (
              <div className="h-full overflow-auto p-4 z-10" 
                   style={{ 
                     borderLeft: '1px solid rgba(var(--mood-color-rgb), 0.1)', 
                     zIndex: 50, 
                     position: 'relative' 
                   }}
              >
                <RightPanel />
              </div>
            )}
          </div>
          {/* Bottom panel with timeline and music */}
          <div className="p-4 pt-0" style={{ borderTop: '1px solid rgba(var(--mood-color-rgb), 0.1)' }}>
            <BottomPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
