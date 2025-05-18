import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import Header from '../components/Header';
import { 
  Plane, 
  Camera, 
  Music, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Compass,
  ImagePlus,
  Sparkles,
  ChevronDown,
  Sticker,
  BookmarkIcon,
  Move,
  Palette,
  Menu,
  X
} from 'lucide-react';

// Mini feature preview component
const FeaturePreview = ({ 
  icon: Icon, 
  title, 
  description,
  previewContent 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  previewContent: React.ReactNode;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="shadow-neo-card rounded-xl bg-neo-bg p-6 transition-all duration-300 hover:shadow-neo-card-hover hover:scale-102 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-neo-flat mb-4 bg-mood-color-10">
        <Icon size={24} className="text-mood-color" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-mood-color">{title}</h3>
      <p className="text-neo-text mb-4">{description}</p>
      
      <div className={`mt-2 rounded-lg overflow-hidden transition-all duration-500 transform ${isHovered ? 'scale-105 shadow-neo-mood-flat' : 'scale-100'}`}>
        {previewContent}
      </div>
    </div>
  );
};

// Mini memory board preview component
const MemoryBoardPreview = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div className="bg-neo-bg rounded-lg p-3 h-[140px] relative border border-mood-color-10">
      {/* Sidebar - changes width based on collapsed state */}
      <div 
        className={`absolute left-0 top-0 bottom-0 bg-mood-color-10/20 transition-all duration-300 rounded-l-lg flex flex-col items-center ${
          sidebarCollapsed ? 'w-6' : 'w-14'
        }`}
      >
        {/* Toggle sidebar button */}
        <button 
          onClick={toggleSidebar}
          className="w-5 h-5 mt-2 rounded-full flex items-center justify-center shadow-neo-flat bg-white transition-all hover:scale-105"
        >
          <svg 
            width="8" 
            height="8" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
          >
            <path 
              d={sidebarCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7M19 19l-7-7 7-7"} 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        {/* Sidebar content - only visible when expanded */}
        <div className={`mt-3 transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-8 h-8 rounded-md bg-mood-color-20 mb-2 mx-auto"></div>
          <div className="w-8 h-4 rounded-md bg-mood-color-20 mb-2 mx-auto"></div>
          <div className="w-8 h-4 rounded-md bg-mood-color-20 mx-auto"></div>
        </div>
      </div>

      {/* Main content - adjusts position based on sidebar state */}
      <div 
        className={`absolute top-0 bottom-0 right-0 transition-all duration-300 ${
          sidebarCollapsed ? 'left-6' : 'left-14'
        }`}
      >
        <div className="absolute top-6 left-8 bg-mood-color-10 w-16 h-16 rounded-md flex items-center justify-center shadow-neo-flat animate-float-slow">
          <span className="text-2xl">🏔️</span>
        </div>
        <div className="absolute top-10 right-12 bg-white w-20 h-14 rounded-md shadow-neo-flat rotate-3 animate-float-slower">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&q=80" 
               alt="Mountain" className="w-full h-full object-cover rounded-md" />
        </div>
        <div className="absolute bottom-5 left-14 bg-mood-color-10 px-3 py-1 rounded-md text-xs shadow-neo-flat animate-float">
          Mountain Hike
        </div>
        <div className="absolute bottom-12 right-6 w-7 h-7 rounded-full flex items-center justify-center bg-mood-color-20 shadow-neo-flat animate-pulse">
          <Move size={14} className="text-mood-color" />
        </div>
      </div>
    </div>
  );
};

// Mini timeline preview
const TimelinePreview = () => {
  return (
    <div className="bg-neo-bg rounded-lg p-3 h-[140px] relative border border-mood-color-10">
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-mood-color-10 transform -translate-x-1/2"></div>
      {[0, 1, 2].map((i) => (
        <div key={i} className={`absolute left-1/2 transform -translate-x-1/2 flex items-center ${
          i === 0 ? 'top-4' : i === 1 ? 'top-1/2 -translate-y-1/2' : 'bottom-4'
        }`}>
          <div className="w-4 h-4 rounded-full bg-mood-color shadow-neo-flat z-10"></div>
          <div className={`absolute left-5 bg-white shadow-neo-card rounded-md p-2 text-xs ${
            i === 1 ? '-translate-y-1/2' : ''
          }`}>
            Day {i + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

// Mini music integration preview
const MusicPreview = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-neo-bg rounded-lg p-3 h-[140px] relative border border-mood-color-10">
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 rounded-md bg-black flex-shrink-0 mr-3">
          <img src="https://i.scdn.co/image/ab67616d00001e02e8b066f70c206551210d902b" 
               alt="Album cover" className="w-full h-full object-cover rounded-md" />
        </div>
        <div>
          <div className="text-xs font-medium text-mood-color">Summer Memories</div>
          <div className="text-xs text-neo-text opacity-70">Travel Playlist</div>
        </div>
      </div>
      
      <div className="w-full h-2 bg-mood-color-10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-mood-color transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="neo-mood-flat rounded-md p-2 animate-pulse-slow">
            <div className="w-full h-8 flex items-center justify-center">
              <Music size={16} className="text-mood-color" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mini location marking preview
const LocationPreview = () => {
  return (
    <div className="bg-neo-bg rounded-lg p-3 h-[140px] relative border border-mood-color-10">
      <div className="w-full h-full rounded-md overflow-hidden relative">
        <img 
          src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/13.3833,52.5167,11,0/300x200?access_token=pk.placeholder" 
          alt="Map"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/300x200?text=Location+Map";
          }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-mood-color rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
            <MapPin size={16} className="text-white" />
          </div>
        </div>
        <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 rounded-md p-2 text-xs">
          <div className="font-medium text-mood-color">Brandenburg Gate</div>
          <div className="text-neo-text opacity-70">Berlin, Germany</div>
        </div>
      </div>
    </div>
  );
};

// Mini photo memories preview
const PhotoPreview = () => {
  return (
    <div className="bg-neo-bg rounded-lg p-3 h-[140px] relative border border-mood-color-10">
      <div className="grid grid-cols-2 gap-2 h-full">
        <div className="col-span-1 row-span-2 rounded-md overflow-hidden shadow-neo-flat">
          <img 
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&q=80" 
            alt="Beach"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-md overflow-hidden shadow-neo-flat">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&q=80" 
            alt="Mountains"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-md overflow-hidden shadow-neo-flat relative group">
          <img 
            src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&q=80" 
            alt="City"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ImagePlus size={16} className="mr-1" /> 5 more
          </div>
        </div>
      </div>
    </div>
  );
};

// Mini journey tracking preview
const JourneyPreview = () => {
  return (
    <div className="bg-neo-bg rounded-lg p-3 h-[140px] relative border border-mood-color-10">
      <div className="w-full h-full rounded-md overflow-hidden relative">
        <img 
          src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/path-5+60A5E6-dash(.1,.1)-width-3(13.3833,52.5167;13.45,52.52;13.5,52.48;13.4,52.45;13.3833,52.5167)/auto/300x200?access_token=pk.placeholder" 
          alt="Journey Map"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/300x200?text=Journey+Map";
          }}
        />
        <div className="absolute top-2 right-2 bg-white rounded-md shadow-neo-flat p-1">
          <Compass size={16} className="text-mood-color" />
        </div>
        <div className="absolute bottom-2 left-2 text-xs bg-white px-2 py-1 rounded-full shadow-neo-flat">
          <span className="text-mood-color font-medium">12.5 km</span>
        </div>
      </div>
    </div>
  );
};

// Sticker library preview
const StickerPreview = () => {
  return (
    <div className="bg-neo-bg rounded-lg p-3 h-[140px] relative border border-mood-color-10">
      <div className="grid grid-cols-3 gap-2">
        {['🏔️', '🌊', '🏝️', '🌄', '✈️', '🚆'].map((emoji, i) => (
          <div key={i} className="neo-button aspect-square flex items-center justify-center hover:scale-105 hover:bg-mood-color-10 transition-all duration-200">
            <span className="text-[20px]">{emoji}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <div className="neo-button py-2 text-xs flex items-center flex-1 justify-center">
          <BookmarkIcon size={12} className="mr-1 text-mood-color" />
          <span>Beach Day</span>
        </div>
        <div className="neo-button py-2 text-xs flex items-center flex-1 justify-center">
          <Palette size={12} className="mr-1 text-mood-color" />
          <span>Colors</span>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ 
  quote, 
  author 
}: { 
  quote: string; 
  author: string;
}) => (
  <div className="shadow-neo-card rounded-xl bg-neo-bg p-6 transition-all duration-300 hover:shadow-neo-card-hover">
    <p className="text-neo-text mb-4 italic">"{quote}"</p>
    <p className="text-mood-color font-semibold">- {author}</p>
  </div>
);

const Landing = () => {

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-neo-bg">
        {/* Using the shared Header component */}
        <Header />

        {/* Hero Section with neomorphic layers */}
        <section className="py-10 sm:py-12 md:py-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto relative">
          {/* Subtle gradient background */}
          <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-mood-color-5/20 via-neo-bg to-mood-color-10/30 opacity-70"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-mood-color-5/10 via-transparent to-transparent"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 relative z-10">
            {/* Left content */}
            <div className="lg:w-1/2 text-left">
              <div className="flex flex-wrap items-center mb-5 sm:mb-6">
                <div className="shadow-neo-flat p-2 sm:p-3 rounded-xl bg-mood-color-10 mr-3 sm:mr-4 mb-2 sm:mb-0">
                  <Plane size={20} className="sm:text-[28px] text-mood-color" />
                </div>
                <div className="text-xs sm:text-sm text-mood-color font-medium py-1 px-2 sm:px-3 rounded-full shadow-neo-card bg-mood-color-10/30">
                  Neomorphic Travel Experience
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-mood-color leading-tight">
                Create Beautiful <br className="hidden md:block" />Travel Memories
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-neo-text mb-6 sm:mb-8 max-w-xl">
                Transform your travel experiences into stunning visual memories with our 
                interactive canvas board and Spotify integration.
              </p>
              
              <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Link to="/app/trips" className="neo-button bg-mood-color text-white font-medium flex items-center justify-center gap-2 text-sm sm:text-base px-3 sm:px-4 py-2">
                  Start Your Journey <ArrowRight size={16} />
                </Link>
                <a href="#features" className="neo-button text-mood-color flex items-center justify-center gap-2 text-sm sm:text-base px-3 sm:px-4 py-2">
                  Explore Features <ChevronDown size={16} />
                </a>
              </div>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-6 sm:mt-8">
                {[
                  { icon: Camera, label: "Photo Memories" },
                  { icon: Music, label: "Spotify Integration" },
                  { icon: Sticker, label: "Custom Stickers" },
                  { icon: Calendar, label: "Timeline View" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-2 px-2 sm:px-3 rounded-lg bg-neo-bg shadow-neo-flat hover:shadow-neo-card transition-all duration-300">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-mood-color-10 shadow-neo-flat">
                      <item.icon size={14} className="sm:text-[16px] text-mood-color" />
                    </div>
                    <span className="text-xs sm:text-sm text-neo-text font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right side - Neomorphic UI Card */}
            <div className="lg:w-1/2 mt-8 sm:mt-10 lg:mt-0 w-full">
              <div className="shadow-neo-card rounded-xl overflow-hidden bg-neo-bg p-4 sm:p-6 relative">
                {/* Layer effect border */}
                <div className="absolute inset-0 rounded-xl overflow-hidden -z-10">
                  <div className="absolute inset-0 bg-mood-color-10/20"></div>
                  <div className="absolute inset-3 bg-neo-bg rounded-lg"></div>
                  <div className="absolute inset-6 bg-mood-color-10/10 rounded-lg"></div>
                </div>
                
                {/* Content canvas - responsive height */}
                <div className="bg-mood-color-10/10 rounded-lg p-3 sm:p-4 h-[300px] sm:h-[350px] md:h-[450px] relative">
                  {/* Sample stickers animated with responsive positioning and sizing */}
                  <div className="absolute top-[15%] left-[15%] bg-white rounded-lg shadow-neo-card p-1 sm:p-2 transform rotate-3 animate-float-slow z-20">
                    <img 
                      src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=240&q=80" 
                      alt="Beach Memory" 
                      className="w-24 sm:w-32 md:w-40 h-16 sm:h-20 md:h-28 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="absolute top-[25%] right-[15%] bg-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-neo-flat transform -rotate-2 animate-float-slower z-10">
                    <span className="text-sm sm:text-base font-medium text-mood-color">Paris, France</span>
                  </div>
                  
                  <div className="absolute bottom-[30%] left-[25%] bg-white rounded-full shadow-neo-flat h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center transform rotate-6 animate-float">
                    <span className="text-2xl sm:text-3xl">🗼</span>
                  </div>
                  
                  <div className="absolute bottom-[35%] right-[20%] shadow-neo-flat bg-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg">
                    <span className="text-xs sm:text-sm font-medium text-mood-color flex items-center">
                      <Calendar size={12} className="mr-1 sm:mr-2 sm:text-[14px]" /> May 8, 2023
                    </span>
                  </div>
                  
                  <div className="absolute top-[10%] right-[30%] shadow-neo-card bg-white rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center animate-float-slow">
                    <span className="text-xl sm:text-2xl">🥐</span>
                  </div>
                  
                  <div className="absolute top-[45%] left-[35%] bg-white rounded-lg shadow-neo-flat p-2 sm:p-3 transform -rotate-3 animate-pulse-slow z-30">
                    <span className="text-mood-color text-xs sm:text-sm font-medium">Eiffel Tower Visit</span>
                  </div>
                  
                  {/* Task cards with responsive sizing */}
                  <div className="absolute bottom-[15%] left-[10%] bg-white rounded-lg shadow-neo-flat p-2 sm:p-3 w-[120px] sm:w-[150px]">
                    <div className="flex items-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-mood-color-10 flex items-center justify-center mr-2">
                        <span className="text-mood-color text-[8px] sm:text-[10px]">20</span>
                      </div>
                      <p className="text-xs text-mood-color font-medium">Visit Museums</p>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-[30%] right-[5%] bg-white rounded-lg shadow-neo-flat p-2 sm:p-3 w-[120px] sm:w-[150px]">
                    <div className="flex items-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-mood-color-10 flex items-center justify-center mr-2">
                        <span className="text-mood-color text-[8px] sm:text-[10px]">25</span>
                      </div>
                      <p className="text-xs text-mood-color font-medium">Local Cuisine</p>
                    </div>
                  </div>
                  
                  {/* Spotify player - bottom card with responsive design */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white rounded-lg shadow-neo-card flex items-center justify-between p-2 sm:p-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-mood-color flex items-center justify-center">
                        <Music size={14} className="sm:text-[18px] text-white" />
                      </div>
                      <div className="text-xs sm:text-sm">
                        <div className="font-medium text-mood-color">Paris Nights</div>
                        <div className="text-[10px] sm:text-xs text-neo-text">Spotify Playlist</div>
                      </div>
                    </div>
                    <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-mood-color-10 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-mood-color animate-music-progress"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Enhanced Neomorphic Style with responsive adjustments */}
        <section id="features" className="py-14 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto relative overflow-hidden">
          {/* Neomorphic decorative elements */}
          <div className="absolute left-0 top-40 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full bg-mood-color-10/20 shadow-neo-mood-flat blur-md -z-10"></div>
          <div className="absolute right-0 bottom-40 w-[150px] sm:w-[250px] h-[150px] sm:h-[250px] rounded-full bg-mood-color-10/10 shadow-neo-mood-flat blur-md -z-10"></div>
          
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 sm:mb-16 gap-6 sm:gap-8">
              <div className="sm:max-w-lg">
                <div className="shadow-neo-card inline-block rounded-xl p-2 sm:p-3 bg-mood-color-10/20 mb-3 sm:mb-4">
                  <Sparkles size={20} className="sm:text-[24px] text-mood-color" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-mood-color">Bring Your Trips to Life</h2>
                <p className="text-base sm:text-lg text-neo-text">
                  Organize, visualize, and relive your travel experiences with our beautiful neomorphic interface
                </p>
              </div>
              
              <div className="neo-button text-mood-color flex items-center gap-2 px-4 sm:px-6 py-2 self-start">
                <span>View All Features</span>
                <ArrowRight size={16} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <FeaturePreview 
                icon={Plane}
                title="Trip Memory Board"
                description="Create a beautiful visual canvas of your travel memories with photos, notes, and stickers."
                previewContent={<MemoryBoardPreview />}
              />
              <FeaturePreview 
                icon={Calendar}
                title="Trip Timeline"
                description="Organize your travel memories chronologically with our intuitive date-based interface."
                previewContent={<TimelinePreview />}
              />
              <FeaturePreview 
                icon={Music}
                title="Trip Soundtrack"
                description="Connect your Spotify account to add the perfect soundtrack to your travel memories."
                previewContent={<MusicPreview />}
              />
              <FeaturePreview 
                icon={Camera}
                title="Photo Memories"
                description="Upload and arrange photos from your travels directly onto your memory board."
                previewContent={<PhotoPreview />}
              />
              <FeaturePreview 
                icon={Sticker}
                title="Custom Stickers"
                description="Decorate your travel memory board with emoji stickers and customizable labels."
                previewContent={<StickerPreview />}
              />
              <FeaturePreview 
                icon={Sparkles}
                title="Beautiful UI"
                description="Enjoy a modern neomorphic interface that makes organizing memories a delight."
                previewContent={<MemoryBoardPreview />}
              />
            </div>
          </div>
        </section>

        {/* Spotify Integration Section - Neomorphic Style */}
        <section id="about" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 relative overflow-hidden">
          {/* Layered neomorphic background */}
          <div className="absolute inset-0 bg-mood-color-10/20 -z-20"></div>
          <div className="absolute inset-0 -z-10">
            <div className="absolute w-full h-full bg-neo-bg opacity-80"></div>
            {/* Circular neomorphic elements */}
            <div className="absolute left-[10%] top-[20%] w-24 sm:w-32 h-24 sm:h-32 rounded-full shadow-neo-mood-flat bg-neo-bg"></div>
            <div className="absolute right-[15%] bottom-[25%] w-28 sm:w-40 h-28 sm:h-40 rounded-full shadow-neo-mood-flat bg-neo-bg"></div>
            <div className="absolute left-[30%] bottom-[10%] w-16 sm:w-24 h-16 sm:h-24 rounded-full shadow-neo-mood-flat bg-neo-bg"></div>
            
            {/* Animated music waves */}
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-full h-[1px] sm:h-[2px] bg-mood-color opacity-10 rounded-full"
                style={{
                  top: `${20 + i * 15}%`,
                  animation: `waveAnimation ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`
                }}
              ></div>
            ))}
          </div>
          
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 sm:gap-16 relative z-10">
            <div className="lg:w-1/2 w-full">
              <div className="shadow-neo-card rounded-2xl overflow-hidden bg-neo-bg p-4 sm:p-6">
                {/* Nested layers for depth */}
                <div className="rounded-xl bg-mood-color-10/20 p-3 sm:p-5 shadow-neo-mood-flat">
                  <div className="rounded-lg overflow-hidden shadow-neo-flat bg-black/5 h-[240px] sm:h-[280px] md:h-[320px] relative">
                    {/* Dynamic Neomorphic Spotify Animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Spotify Logo */}
                      <div className="absolute w-20 h-20 sm:w-24 sm:h-24 bg-neo-bg rounded-full shadow-neo-card flex items-center justify-center z-10 animate-float-slow">
                        <svg className="w-12 h-12 sm:w-14 sm:h-14 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </div>
                      
                      {/* Profile/App Icon */}
                      <div className="absolute -bottom-4 sm:-bottom-6 -right-6 sm:-right-8 w-16 h-16 sm:w-20 sm:h-20 bg-neo-bg rounded-full shadow-neo-card flex items-center justify-center animate-float">
                        <Plane size={24} className="sm:text-[32px] text-mood-color" />
                      </div>
                      
                      {/* Connection Lines */}
                      <div className="absolute w-full h-full">
                        {/* Pulsing connection line 1 */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-mood-color/50 to-transparent animate-gradient-shift" style={{ animationDuration: '3s' }}></div>
                        
                        {/* Pulsing connection line 2 */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-mood-color/30 to-transparent animate-gradient-shift" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>

                        {/* Music Waves - sound visualizer style */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-1 sm:gap-2">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1 sm:w-1.5 h-6 sm:h-8 bg-mood-color rounded-full"
                              style={{
                                animation: `waveAnimation ${1 + i * 0.2}s ease-in-out infinite`,
                                animationDelay: `${i * 0.1}s`,
                                opacity: 0.6 + (i * 0.08)
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Connecting Dots */}
                      <div className="absolute top-1/3 left-1/4 w-2 h-2 sm:w-3 sm:h-3 bg-mood-color rounded-full animate-pulse-slow"></div>
                      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 sm:w-3 sm:h-3 bg-mood-color rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
                      
                      {/* Status Text - Connected */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-neo-bg shadow-neo-card rounded-full">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-[#1DB954] animate-pulse-slow"></div>
                          <span className="text-xs sm:text-sm font-medium">Connected to Spotify</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Spotify controls - neomorphic style */}
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-neo-bg rounded-lg shadow-neo-flat flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-mood-color flex items-center justify-center shadow-neo-flat">
                        <Music size={14} className="sm:text-[18px] text-white" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-mood-color">Travel Vibes</div>
                        <div className="text-[10px] sm:text-xs text-neo-text">Now Playing</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-neo-flat">
                        <svg width="12" height="12" className="sm:w-[14px] sm:h-[14px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-neo-flat">
                        <svg width="14" height="14" className="sm:w-[16px] sm:h-[16px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-neo-flat">
                        <svg width="12" height="12" className="sm:w-[14px] sm:h-[14px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="inline-block shadow-neo-card rounded-xl p-2 sm:p-3 bg-neo-bg mb-4 sm:mb-6">
                <Music size={20} className="sm:text-[24px] text-mood-color" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-mood-color">Music Brings Memories to Life</h2>
              <p className="text-base sm:text-lg text-neo-text mb-6 sm:mb-8">
                Music has the power to transport you back to special moments. Connect your Spotify account to add the perfect soundtrack to your travel memories.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mb-8 sm:mb-10">
                {[
                  { icon: Music, text: "Create custom travel playlists" },
                  { icon: Sparkles, text: "Attach songs to specific memories" },
                  { icon: ImagePlus, text: "Enhance your visual memories with audio" },
                  { icon: BookmarkIcon, text: "Save your favorite travel tracks" }
                ].map((item, index) => (
                  <div key={index} className="shadow-neo-flat rounded-lg p-3 sm:p-4 bg-neo-bg flex items-center gap-3 sm:gap-4 hover:shadow-neo-card transition-all duration-300">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shadow-neo-flat bg-mood-color-10">
                      <item.icon size={16} className="sm:text-[18px] text-mood-color" />
                    </div>
                    <span className="text-sm sm:text-base text-neo-text font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <button className="neo-button bg-mood-color text-white font-medium flex items-center justify-center gap-2 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base">
                Connect Spotify <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Testimonials - Neomorphic Cards */}
        <section id="testimonials" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto relative">
          {/* Neomorphic background accent */}
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[100px] sm:w-[200px] h-[300px] sm:h-[400px] rounded-l-full bg-mood-color-10/10 shadow-neo-mood-flat blur-sm -z-10"></div>
          
          <div className="flex flex-col md:flex-row items-start justify-between mb-10 sm:mb-16 gap-8 sm:gap-10">
            <div className="md:max-w-md">
              <div className="shadow-neo-card inline-block rounded-xl p-2 sm:p-3 bg-neo-bg mb-4 sm:mb-6">
                <div className="text-mood-color text-xl sm:text-2xl">❝</div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-mood-color">What Travelers Are Saying</h2>
              <p className="text-base sm:text-lg text-neo-text">
                Discover how Trip Canvas Vibes is helping travelers around the world preserve their cherished memories
              </p>
            </div>
            
            <div className="shadow-neo-flat bg-neo-bg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:w-80 w-full">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-medium text-mood-color text-sm sm:text-base">Overall Rating</h3>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="text-mood-color text-sm sm:text-base">★</div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {[
                  { label: "User Experience", value: 95 },
                  { label: "Design Quality", value: 98 },
                  { label: "Features", value: 90 }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="text-neo-text">{item.label}</span>
                      <span className="text-mood-color font-medium">{item.value}%</span>
                    </div>
                    <div className="w-full h-1.5 sm:h-2 bg-mood-color-10/30 rounded-full overflow-hidden shadow-neo-pressed">
                      <div
                        className="h-full bg-mood-color rounded-full"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                quote: "Trip Canvas Vibes completely changed how I document my travels. The ability to combine photos with music brings back vivid memories.",
                author: "Sarah T., World Explorer",
                rating: 5
              },
              {
                quote: "The neomorphic design is so beautiful and intuitive. I love creating memory boards for each of my trips.",
                author: "Michael R., Photographer",
                rating: 5
              },
              {
                quote: "Connecting my Spotify playlists to my travel memories was a game-changer. Now I can relive my journeys through music.",
                author: "Emma L., Music Lover",
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} className="shadow-neo-card rounded-xl p-4 sm:p-6 bg-neo-bg hover:shadow-neo-card-hover transition-all duration-300">
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="text-mood-color text-sm sm:text-base">★</div>
                  ))}
                </div>
                <p className="text-neo-text text-sm sm:text-base mb-4 sm:mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-mood-color text-sm sm:text-base">{testimonial.author}</span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-mood-color-10 flex items-center justify-center shadow-neo-flat">
                    <span className="text-mood-color text-xs sm:text-sm">
                      {testimonial.author.split(" ")[0][0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section - Neomorphic Card Style */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 relative">
          <div className="max-w-5xl mx-auto">
            <div className="shadow-neo-card rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 bg-neo-bg relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -right-20 -top-20 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-mood-color-10/20 -z-10"></div>
              <div className="absolute -left-16 -bottom-16 w-40 sm:w-60 h-40 sm:h-60 rounded-full bg-mood-color-10/10 -z-10"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12 relative z-10">
                <div className="md:w-2/3">
                  <div className="inline-block shadow-neo-flat rounded-full p-3 sm:p-4 bg-mood-color-10 mb-4 sm:mb-6">
                    <Sparkles size={18} className="sm:text-[24px] text-mood-color" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-mood-color">Start Creating Your Travel Story</h2>
                  <p className="text-base sm:text-lg text-neo-text mb-6 sm:mb-8">
                    Transform your travel experiences into beautiful visual memories. 
                    Start your journey with Trip Canvas Vibes today.
                  </p>
                  <Link to="/app/trips" className="neo-button bg-mood-color text-white font-medium px-6 sm:px-8 py-2 sm:py-3 inline-flex items-center justify-center gap-2 text-sm sm:text-base">
                    Create Your First Trip <ArrowRight size={16} />
                  </Link>
                </div>
                
                <div className="md:w-1/3 w-full">
                  <div className="shadow-neo-flat rounded-xl p-4 sm:p-5 bg-neo-bg relative h-40 sm:h-52 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 w-12 sm:w-16 h-12 sm:h-16 rounded-lg shadow-neo-flat bg-mood-color-10/50 transform rotate-12 animate-float-slow"></div>
                        <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-8 sm:w-12 h-8 sm:h-12 rounded-lg shadow-neo-flat bg-mood-color-10/50 transform -rotate-6 animate-float"></div>
                        <div className="shadow-neo-card rounded-xl p-3 sm:p-4 bg-neo-bg">
                          <Plane size={30} className="sm:text-[40px] text-mood-color mb-2 sm:mb-3" />
                          <p className="text-sm sm:text-base text-neo-text font-medium">Ready for your next adventure?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Neomorphic Style */}
        <footer className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-10 shadow-neo-flat bg-neo-bg">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="shadow-neo-flat w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-mood-color-10">
                  <Plane size={18} className="sm:text-[24px] text-mood-color" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-mood-color">Trip Canvas Vibes</h3>
                  <p className="text-xs sm:text-sm text-neo-text">Create beautiful travel memories</p>
                </div>
              </div>
              
              <div className="flex gap-6 sm:gap-8">
                <a href="#features" className="text-sm sm:text-base text-neo-text hover:text-mood-color transition-colors">Features</a>
                <a href="#about" className="text-sm sm:text-base text-neo-text hover:text-mood-color transition-colors">About</a>
                <a href="#testimonials" className="text-sm sm:text-base text-neo-text hover:text-mood-color transition-colors">Testimonials</a>
              </div>
              
              <div className="flex gap-3 sm:gap-4">
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-neo-flat flex items-center justify-center hover:shadow-neo-card transition-all duration-300">
                  <svg width="16" height="16" className="sm:w-[20px] sm:h-[20px] text-mood-color" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-neo-flat flex items-center justify-center hover:shadow-neo-card transition-all duration-300">
                  <svg width="16" height="16" className="sm:w-[20px] sm:h-[20px] text-mood-color" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-neo-flat flex items-center justify-center hover:shadow-neo-card transition-all duration-300">
                  <svg width="16" height="16" className="sm:w-[20px] sm:h-[20px] text-mood-color" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                </a>
              </div>
            </div>
            
            <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-mood-color-10/20 text-center">
              <p className="text-xs sm:text-sm text-neo-text">© {new Date().getFullYear()} Trip Canvas Vibes. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Landing; 