import React, { useState, useEffect } from 'react';
import { useTrip } from '../hooks/use-trip';
import { useTheme } from '../hooks/use-theme';
import { format } from 'date-fns';
import { ThemeProvider } from '../contexts/ThemeContext';
import { TripProvider } from '../contexts/TripProvider';
import TripCard from '../components/TripCard';
import TripPreview from '../components/TripPreview';
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MoodColor } from '../types';
import { 
  MapPin, 
  Plus, 
  Plane, 
  PlusCircle, 
  Paintbrush, 
  Calendar as CalendarIcon,
  ChevronLeft,
  Edit,
  Compass,
  Text,
  Globe,
  Map,
  Camera,
  Info,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TripsPage = () => {
  const { trips, createTrip } = useTrip();
  const { getMoodColorHex, setCurrentMoodColor } = useTheme();
  
  // Show creation form by default if no trips exist
  const [isCreating, setIsCreating] = useState(trips.length === 0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [moodColor, setMoodColor] = useState<MoodColor>('blue');
  const [showSuccess, setShowSuccess] = useState(false);

  // Effect to automatically show form when trips array becomes empty
  useEffect(() => {
    if (trips.length === 0) {
      setIsCreating(true);
    }
  }, [trips]);

  // Handle color change to update preview
  const handleColorChange = (color: MoodColor) => {
    setMoodColor(color);
    setCurrentMoodColor(color);
  };

  // Handle trip creation form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && startDate && endDate) {
      createTrip(title, startDate, endDate, moodColor, description, location);
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setStartDate(new Date());
      setEndDate(new Date());
      setMoodColor('blue');
      setIsCreating(false);
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const themeOptions: { color: MoodColor; name: string; description: string }[] = [
    { color: 'blue', name: 'Ocean Blue', description: 'Perfect for beach trips and coastal adventures' },
    { color: 'green', name: 'Forest Green', description: 'Great for hiking, camping and nature exploration' },
    { color: 'purple', name: 'Lavender', description: 'Ideal for relaxing retreats and wellness journeys' },
    { color: 'pink', name: 'Rose Pink', description: 'Perfect for romantic getaways and special celebrations' },
    { color: 'orange', name: 'Sunset Orange', description: 'Captures the energy of adventure and excitement' },
  ];

  return (
    <div className="min-h-screen bg-neo-bg p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/app" className="mr-4 shadow-neo-flat p-2 rounded-full hover:shadow-neo-pressed transition-all duration-200">
            <ChevronLeft size={20} className="text-mood-color" />
          </Link>
          <h1 className="text-3xl font-bold text-mood-color">Your Trips</h1>
        </div>
        
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="neo-button bg-neo-bg text-mood-color font-medium transition-all duration-300 hover:shadow-neo-mood-convex active:shadow-neo-mood-pressed flex items-center"
          >
            <PlusCircle size={18} className="mr-2" /> Create Trip
          </button>
        )}
      </div>

      {showSuccess && (
        <div 
          className="neo-mood-flat mb-6 p-4 text-center animate-fade-in rounded-lg"
        >
          <p className="font-medium text-mood-color">
            Trip created successfully!
          </p>
        </div>
      )}

      {isCreating ? (
        <div className="shadow-neo-card rounded-xl bg-neo-bg overflow-hidden p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-mood-color flex items-center">
              <Globe className="mr-2" size={20} />
              Create New Trip
            </h2>
            <button 
              onClick={() => setIsCreating(false)}
              className="text-neo-text hover:text-mood-color transition-colors"
            >
              Cancel
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
            {/* Trip creation form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Trip Title - more prominent */}
                <div className="shadow-neo-flat rounded-xl p-4">
                  <label htmlFor="title" className="block text-mood-color font-medium flex items-center text-lg mb-2">
                    <Edit size={18} className="mr-2 text-mood-color" />
                    Trip Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Manali Trip 2025"
                    className="neo-input w-full text-lg p-3 focus:shadow-neo-mood-flat focus:outline-none transition-all duration-300"
                    required
                  />
                </div>

                {/* Trip Description */}
                <div>
                  <label htmlFor="description" className="block text-mood-color font-medium flex items-center mb-2">
                    <Text size={16} className="mr-2" />
                    Trip Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your trip plans, goals or special moments you want to capture..."
                    className="neo-input w-full h-20 focus:shadow-neo-mood-flat focus:outline-none transition-all duration-300 resize-none p-3"
                  />
                </div>

                {/* Location input */}
                <div>
                  <label htmlFor="location" className="block text-mood-color font-medium flex items-center mb-2">
                    <MapPin size={16} className="mr-2" />
                    Destination
                  </label>
                  <div className="relative">
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Paris, France"
                      className="neo-input w-full pl-10 focus:shadow-neo-mood-flat focus:outline-none transition-all duration-300"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Globe size={16} className="text-mood-color opacity-70" />
                    </div>
                  </div>
                  <p className="text-xs mt-1 text-neo-text opacity-70 flex items-center">
                    <Info size={12} className="mr-1" /> Enter your main destination location
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-mood-color font-medium flex items-center">
                      <CalendarIcon size={16} className="mr-2" />
                      Start Date
                    </label>
                    <div className="neo-card p-2 rounded-xl">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        className="neo-calendar"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-mood-color font-medium flex items-center">
                      <CalendarIcon size={16} className="mr-2" />
                      End Date
                    </label>
                    <div className="neo-card p-2 rounded-xl">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < startDate!}
                        className="neo-calendar"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-mood-color font-medium flex items-center">
                    <Paintbrush size={16} className="mr-2" /> Theme Color
                  </label>
                  <p className="text-sm text-neo-text opacity-70">Choose a color that captures the mood of your journey</p>
                  <RadioGroup 
                    value={moodColor} 
                    onValueChange={(value) => handleColorChange(value as MoodColor)}
                    className="flex flex-wrap gap-4 justify-start mt-3"
                  >
                    <TooltipProvider>
                      {themeOptions.map((item) => (
                        <Tooltip key={item.color}>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-center group">
                              <div className="relative">
                                <div 
                                  className={`w-12 h-12 rounded-full transition-all duration-300 cursor-pointer
                                    ${moodColor === item.color 
                                      ? 'scale-110 shadow-neo-pressed transform-gpu' 
                                      : 'hover:scale-105 shadow-neo-convex group-hover:ring-2'
                                    }
                                  `}
                                  style={{ 
                                    backgroundColor: getMoodColorHex(item.color),
                                    boxShadow: moodColor === item.color 
                                      ? 'inset 2px 2px 5px rgba(0, 0, 0, 0.15), inset -2px -2px 5px rgba(255, 255, 255, 0.7)'
                                      : '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.8)',
                                    '--ring-color': getMoodColorHex(item.color)
                                  } as React.CSSProperties}
                                >
                                  {moodColor === item.color && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                  )}
                                  <RadioGroupItem 
                                    value={item.color} 
                                    id={item.color} 
                                    className="sr-only"
                                  />
                                </div>
                              </div>
                              <label 
                                htmlFor={item.color} 
                                className={`text-xs mt-2 cursor-pointer transition-all duration-200 ${moodColor === item.color ? 'text-mood-color font-medium' : 'text-neo-text'}`}
                              >
                                {item.name}
                              </label>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="p-2 max-w-xs">
                            {item.description}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </RadioGroup>
                </div>

                <button
                  type="submit"
                  className="neo-button w-full bg-neo-bg text-mood-color font-medium text-lg transition-all duration-300 hover:shadow-neo-mood-convex active:shadow-neo-mood-pressed mt-6 py-3"
                >
                  <Plane size={18} className="mr-2 inline-block" /> Create Trip
                </button>
              </form>
            </div>
            
            {/* Theme preview */}
            <div className="flex flex-col">
              <h3 className="text-mood-color font-medium mb-3 flex items-center">
                <Camera size={16} className="mr-2" />
                Preview
              </h3>
              <div className="flex-1 sticky top-4">
                <TripPreview 
                  moodColor={moodColor} 
                  title={title || "Trip Preview"} 
                  startDate={startDate}
                  endDate={endDate}
                  location={location}
                  description={description}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {trips.length === 0 ? (
            <div className="shadow-neo-card rounded-xl bg-neo-bg overflow-hidden transition-all duration-200 hover:shadow-neo-card-hover">
              <div className="p-8 text-center">
                <div className="relative mx-auto w-32 h-32 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full bg-mood-color-10 animate-pulse-slow"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Plane size={64} className="text-mood-color animate-bounce-slow" />
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-2 text-mood-color">No trips yet</h2>
                <p className="text-neo-text mb-4 max-w-md mx-auto">Create your first trip to begin your memory board journey</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-lg mx-auto">
                  <div className="shadow-neo-flat rounded-lg p-3 text-center">
                    <Map size={24} className="text-mood-color mb-2 mx-auto" />
                    <p className="text-xs text-neo-text">Track your journey</p>
                  </div>
                  <div className="shadow-neo-flat rounded-lg p-3 text-center">
                    <Camera size={24} className="text-mood-color mb-2 mx-auto" />
                    <p className="text-xs text-neo-text">Save memories</p>
                  </div>
                  <div className="shadow-neo-flat rounded-lg p-3 text-center">
                    <Compass size={24} className="text-mood-color mb-2 mx-auto" />
                    <p className="text-xs text-neo-text">Explore new places</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsCreating(true)}
                  className="neo-button bg-neo-bg text-mood-color font-medium transition-all duration-300 hover:shadow-neo-mood-convex active:shadow-neo-mood-pressed py-3 px-6"
                >
                  <PlusCircle size={18} className="mr-2" /> Start Your First Trip
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
              <div 
                onClick={() => setIsCreating(true)}
                className="shadow-neo-card rounded-xl bg-neo-bg overflow-hidden transition-all duration-300 hover:shadow-neo-card-hover cursor-pointer flex items-center justify-center"
              >
                <div className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full shadow-neo-flat flex items-center justify-center mb-4 mx-auto">
                    <Plus size={24} className="text-mood-color" />
                  </div>
                  <h3 className="text-xl font-medium text-mood-color mb-2">Create New Trip</h3>
                  <p className="text-sm text-neo-text">Start planning your next adventure</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Wrap with providers to ensure it works as a standalone page
const Trips = () => (
  <TripsPage />
);

export default Trips; 