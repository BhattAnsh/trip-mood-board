import React, { useState, useRef, useEffect } from 'react';
import { useTrip } from '../hooks/use-trip';
import { useTheme } from '../hooks/use-theme';
import { useIsMobile } from '../hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, Bookmark, Map, MapPin, TabletSmartphone, Info } from 'lucide-react';

// Mobile notice component for sticker library
const MobileLibraryNotice = ({ colorHex }: { colorHex: string }) => (
  <div className="mb-4 p-3 rounded-lg border border-neo-border bg-neo-bg" style={{ borderColor: `${colorHex}30` }}>
    <div className="flex gap-2 items-start">
      <div className="rounded-full p-1.5" style={{ backgroundColor: `${colorHex}20` }}>
        <Info size={16} style={{ color: colorHex }} />
      </div>
      <div>
        <p className="text-xs text-neo-text">
          <span className="font-medium" style={{ color: colorHex }}>Mobile View:</span> You can view the sticker library, 
          but for the best experience with adding stickers to your memory board, please switch to a tablet or desktop device.
        </p>
      </div>
    </div>
  </div>
);

const emojis = [
  '🏔️', '🌊', '🏝️', '🌄', '🌅', '🌇', '🌃', '🏙️',
  '🚗', '✈️', '🚆', '🚢', '🚶‍♂️', '🚶‍♀️', '🧗‍♂️', '🧗‍♀️',
  '🍔', '🍕', '🍜', '🍣', '🍦', '🍹', '🍸', '🥂',
  '📸', '🎥', '🎬', '🎨', '🎭', '🎤', '🎧', '🎮',
  '👫', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👩‍👩‍👧‍👦', '👨‍👨‍👧‍👦', '🐱', '🐶', '🦜'
];

const labels = [
  'Sunrise', 'Sunset', 'Beach Day', 'Mountain Hike', 'Food Tour',
  'Shopping', 'Museum Visit', 'Concert Night', 'Road Trip', 'Camping',
  'Swimming', 'Trekking', 'City Tour', 'Local Market', 'Hidden Gem'
];

// Memory ticket templates
const memoryTickets = [
  { label: 'Flight Ticket ✈️', content: 'Destination: New York\nDate: Oct 15, 2024\nTime: 10:30 AM' },
  { label: 'Hotel Receipt 🏨', content: 'Ocean View Resort\nStay: 3 nights\nRoom: Deluxe King' },
  { label: 'Restaurant Bill 🍽️', content: 'Seafood Bistro\nTotal: $85\nRating: ★★★★☆' },
  { label: 'Tour Pass 🚌', content: 'City Sightseeing\nAdult Pass\nValid: Oct 16-18' },
  { label: 'Shopping List ✓', content: 'Souvenirs\nLocal crafts\nPostcards' },
  { label: 'Todo List ✓', content: 'Visit museum\nLocal food\nTake photos' },
];

// Map templates to add
const mapTemplates = [
  { name: 'United States Map', id: 'us-map', template: 'MAP_OUTLINE' },
];

// Sample images for immediate use
const defaultImages = [
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%2360A5E6' /%3E%3Cpath d='M80,30 L120,30 L140,60 L100,120 L60,60 Z' fill='white' /%3E%3Ccircle cx='100' cy='80' r='30' fill='%23FFEB3B' /%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23FF7043' /%3E%3Cpath d='M100,20 C130,20 160,40 160,75 C160,110 130,130 100,130 C70,130 40,110 40,75 C40,40 70,20 100,20 Z' fill='%23FFEB3B' /%3E%3C/svg%3E"
];

const StickerLibrary = () => {
  const { addSticker, currentTrip } = useTrip();
  const { getMoodColorHex } = useTheme();
  const isMobile = useIsMobile();
  const [customLabel, setCustomLabel] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>(defaultImages);
  const [isScrolling, setIsScrolling] = useState(true);
  const [activeTab, setActiveTab] = useState('emojis');
  
  // Separate refs for each tab
  const emojisScrollRef = useRef<HTMLDivElement>(null);
  const imagesScrollRef = useRef<HTMLDivElement>(null);
  const labelsScrollRef = useRef<HTMLDivElement>(null);
  const ticketsScrollRef = useRef<HTMLDivElement>(null);
  const mapsScrollRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // Add image immediately as a sticker
          const imageData = event.target.result.toString();
          setUploadedImages(prev => [...prev, imageData]);
          addSticker('image', imageData);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddCustomLabel = () => {
    if (customLabel.trim()) {
      addSticker('label', customLabel);
      setCustomLabel('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomLabel();
    }
  };

  // Custom scroll handlers for neomorphic scrollbar
  const handleScroll = () => {
    setIsScrolling(true);
    const scrollTimeout = setTimeout(() => setIsScrolling(false), 1000);
    return () => clearTimeout(scrollTimeout);
  };

  // Always show scrollbar initially and on tab change
  useEffect(() => {
    setIsScrolling(true);
    const timeout = setTimeout(() => setIsScrolling(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsScrolling(true);
    const timeout = setTimeout(() => setIsScrolling(false), 3000);
    return () => clearTimeout(timeout);
  };

  const handleAddEmoji = (emoji: string) => {
    console.log('Adding emoji sticker:', emoji);
    addSticker('emoji', emoji);
  };
  
  const handleAddLabel = (label: string) => {
    console.log('Adding label sticker:', label);
    addSticker('label', label);
  };
  
  const handleAddTicket = (content: string) => {
    console.log('Adding ticket sticker');
    addSticker('label', content);
  };
  
  const handleAddImage = (image: string) => {
    console.log('Adding image sticker');
    addSticker('image', image);
  };

  const handleMapTemplateAdd = (templateId: string) => {
    // Add a special map sticker that will be rendered differently
    console.log('Adding map template with ID:', templateId);
    
    // Add a large map sticker to serve as background
    addSticker('label', 'MAP_OUTLINE');
    
    // Provide visual feedback that map was added
    alert('Map added! You can now pin memories to your map.');
  };
  
  // Skip rendering on mobile - it's already filtered in the Index component, but this is a safeguard
  if (isMobile) return null;
  
  if (!currentTrip) return null;

  const colorHex = getMoodColorHex(currentTrip.moodColor);

  return (
    <div className="w-full h-full flex flex-col relative z-20">
      <h2 className="text-xl font-semibold mb-2 text-mood-color">Sticker Library</h2>
      
      {isMobile && <MobileLibraryNotice colorHex={colorHex} />}
      
      <Tabs defaultValue="emojis" className="w-full flex-1 flex flex-col" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-5 mb-3">
          <TabsTrigger value="emojis" className="py-1.5 text-sm">Emojis</TabsTrigger>
          <TabsTrigger value="images" className="py-1.5 text-sm">Images</TabsTrigger>
          <TabsTrigger value="labels" className="py-1.5 text-sm">Labels</TabsTrigger>
          <TabsTrigger value="tickets" className="py-1.5 text-sm">Tickets</TabsTrigger>
          <TabsTrigger value="maps" className="py-1.5 text-sm">Maps</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 relative overflow-hidden">
          <TabsContent value="emojis" className="absolute inset-0 flex flex-col">
            <div 
              ref={emojisScrollRef}
              className="flex-1 overflow-y-auto custom-scrollbar pr-3 pb-2"
              onScroll={handleScroll}
            >
              <div className="grid grid-cols-5 gap-2 pb-3">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddEmoji(emoji)}
                    className="emoji-preview aspect-square flex items-center justify-center transition-all duration-200 hover:scale-110 p-0 relative z-20"
                    aria-label={`Add ${emoji} sticker`}
                  >
                    <span className="text-[28px] transform-gpu">{emoji}</span>
                  </button>
                ))}
              </div>
            </div>
            {activeTab === 'emojis' && (
              <div className={`neo-scrollbar ${isScrolling ? 'visible' : 'invisible'}`}></div>
            )}
          </TabsContent>
          
          <TabsContent value="images" className="absolute inset-0 flex flex-col">
            <div className="flex justify-center mb-3">
              <label 
                htmlFor="image-upload" 
                className="bg-mood-color text-white neo-button inline-flex items-center justify-center px-3 py-1.5 text-sm cursor-pointer transition-all duration-200 hover:opacity-90 relative z-20"
              >
                <Upload size={14} className="mr-1.5" />
                Upload Image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                multiple
              />
            </div>
            
            <div 
              ref={imagesScrollRef}
              className="flex-1 overflow-y-auto custom-scrollbar pr-3 pb-2"
              onScroll={handleScroll}
            >
              <div className="grid grid-cols-2 gap-2 pb-3">
                {uploadedImages.length === 0 ? (
                  <div className="col-span-2 text-center text-neo-text opacity-70 py-6 neo-pressed">
                    <p className="mb-1 text-sm">No images uploaded yet</p>
                    <p className="text-xs">Upload images to add to your trip</p>
                  </div>
                ) : (
                  uploadedImages.map((image, index) => (
                    <div 
                      key={index} 
                      className="neo-mood-flat p-1.5 aspect-square hover:scale-105 transition-all duration-200 cursor-pointer relative z-20"
                      onClick={() => handleAddImage(image)}
                    >
                      <img
                        src={image}
                        alt={`Uploaded ${index}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
            {activeTab === 'images' && (
              <div className={`neo-scrollbar ${isScrolling ? 'visible' : 'invisible'}`}></div>
            )}
          </TabsContent>
          
          <TabsContent value="labels" className="absolute inset-0 flex flex-col">
            <div className="mb-3 flex">
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add custom label..."
                className="neo-input flex-1 focus:shadow-neo-mood-flat focus:outline-none text-sm py-1.5 relative z-20"
              />
              <button
                onClick={handleAddCustomLabel}
                className="bg-mood-color text-white neo-button ml-2 transition-all duration-200 hover:opacity-90 min-w-[32px] flex items-center justify-center relative z-20"
                disabled={!customLabel.trim()}
                aria-label="Add custom label"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div 
              ref={labelsScrollRef}
              className="flex-1 overflow-y-auto custom-scrollbar pr-3 pb-2"
              onScroll={handleScroll}
            >
              <div className="grid grid-cols-1 gap-1.5 pb-3">
                {labels.map((label, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddLabel(label)}
                    className="neo-button py-2 text-left transition-all duration-200 hover:text-mood-color hover:bg-mood-color-10 hover:scale-102 flex items-center relative z-20"
                  >
                    <Bookmark size={14} className="mr-1.5 text-mood-color opacity-80" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            {activeTab === 'labels' && (
              <div className={`neo-scrollbar ${isScrolling ? 'visible' : 'invisible'}`}></div>
            )}
          </TabsContent>
          
          {/* New Memory Tickets tab */}
          <TabsContent value="tickets" className="absolute inset-0 flex flex-col">
            <div 
              ref={ticketsScrollRef}
              className="flex-1 overflow-y-auto custom-scrollbar pr-3 pb-2"
              onScroll={handleScroll}
            >
              <div className="grid grid-cols-1 gap-2 pb-3">
                {memoryTickets.map((ticket, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddTicket(ticket.content)}
                    className="ticket-preview p-3 text-left transition-all duration-200 hover:scale-102 flex flex-col relative z-20"
                  >
                    <div className="ticket-preview-holes-left" />
                    <div className="ticket-preview-holes-right" />
                    <span className="text-sm font-medium text-mood-color mb-1">{ticket.label}</span>
                    <span className="text-xs whitespace-pre-line handwritten-shadows">{ticket.content}</span>
                  </button>
                ))}
              </div>
            </div>
            {activeTab === 'tickets' && (
              <div className={`neo-scrollbar ${isScrolling ? 'visible' : 'invisible'}`}></div>
            )}
          </TabsContent>
          
          {/* New Maps tab */}
          <TabsContent value="maps" className="absolute inset-0 flex flex-col">
            <div 
              ref={mapsScrollRef}
              className="flex-1 overflow-y-auto custom-scrollbar pr-3 pb-2"
              onScroll={handleScroll}
            >
              <div className="grid grid-cols-1 gap-3 pb-3">
                <div className="text-xs mb-1 px-1">
                  <p className="text-neo-text">Add a map to your memory board to create a travel-themed background. You can then pin your memories on the map.</p>
                </div>
                
                {mapTemplates.map((mapTemplate, index) => (
                  <button
                    key={index}
                    onClick={() => handleMapTemplateAdd(mapTemplate.id)}
                    className="neo-button p-3 text-left transition-all duration-200 hover:bg-mood-color-10 hover:scale-102 flex items-center justify-between relative z-20"
                  >
                    <div className="flex items-center">
                      <Map size={20} className="mr-2 text-mood-color" />
                      <span className="text-sm font-medium">{mapTemplate.name}</span>
                    </div>
                    <div className="bg-mood-color rounded-full p-1">
                      <Plus size={14} className="text-white" />
                    </div>
                  </button>
                ))}
                
                <div className="flex items-center justify-center mt-2">
                  <div className="text-center p-3 rounded-lg bg-neo-bg shadow-neo-pressed text-xs text-neo-text opacity-70">
                    <p>More map templates coming soon!</p>
                  </div>
                </div>
              </div>
            </div>
            {activeTab === 'maps' && (
              <div className={`neo-scrollbar ${isScrolling ? 'visible' : 'invisible'}`}></div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default StickerLibrary;
