import React, { useState, ReactNode, useContext, useEffect } from 'react';
import { Trip, Sticker, MoodColor } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { TripContext } from './TripContextValue';
import { ThemeContext } from './ThemeContextValue';

// Sample trips data
const sampleTrips: Omit<Trip, 'startDate' | 'endDate'>[] = [
  {
    id: uuidv4(),
    title: "Bali Adventure",
    moodColor: 'blue',
    description: "Exploring beaches, temples, and rice terraces in Bali",
    location: "Bali, Indonesia",
    stickers: []
  },
  {
    id: uuidv4(),
    title: "Himalayan Trek",
    moodColor: 'green',
    description: "Hiking through the majestic Himalayan mountains",
    location: "Manali, India",
    stickers: []
  },
  {
    id: uuidv4(),
    title: "Paris Getaway",
    moodColor: 'pink',
    description: "Cultural tour of museums, cafes, and historical sites",
    location: "Paris, France",
    stickers: []
  }
];

// Prepare sample trips with dates
const prepareSampleTrips = (): Trip[] => {
  const now = new Date();
  return sampleTrips.map((trip, index) => {
    const startDate = new Date();
    startDate.setDate(now.getDate() + index * 14); // Each trip starts 14 days after the previous one
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7); // Each trip lasts 7 days
    
    return {
      ...trip,
      startDate,
      endDate
    };
  });
};

// TripProvider props interface
interface TripProviderProps {
  children: ReactNode;
};

export const TripProvider = ({ children }: TripProviderProps) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [currentDay, setCurrentDay] = useState<number>(0);
  
  // Get theme context directly (may be undefined if not in ThemeProvider)
  const theme = useContext(ThemeContext);

  // Load trips from localStorage on mount
  useEffect(() => {
    const savedTrips = localStorage.getItem('trips');
    const savedCurrentTripId = localStorage.getItem('currentTripId');
    
    if (savedTrips) {
      try {
        const parsedTrips = JSON.parse(savedTrips).map((trip: Omit<Trip, 'startDate' | 'endDate'> & { startDate: string; endDate: string }) => ({
          ...trip,
          startDate: new Date(trip.startDate),
          endDate: new Date(trip.endDate)
        }));
        setTrips(parsedTrips);
        
        // Restore current trip if it exists
        if (savedCurrentTripId) {
          const currentTrip = parsedTrips.find((t: Trip) => t.id === savedCurrentTripId);
          if (currentTrip) {
            setCurrentTrip(currentTrip);
            // Update theme if available
            if (theme && theme.setCurrentMoodColor) {
              theme.setCurrentMoodColor(currentTrip.moodColor);
            }
          }
        }
      } catch (error) {
        console.error('Error parsing saved trips:', error);
        // If there's an error parsing, initialize with sample trips
        initializeSampleTrips();
      }
    } else {
      // If no trips in localStorage, initialize with sample trips
      initializeSampleTrips();
    }
  }, []);

  // Initialize with sample trip data
  const initializeSampleTrips = () => {
    const initialTrips = prepareSampleTrips();
    setTrips(initialTrips);
    localStorage.setItem('trips', JSON.stringify(initialTrips));
  };

  // Save trips to localStorage whenever they change
  useEffect(() => {
    if (trips.length > 0) {
      localStorage.setItem('trips', JSON.stringify(trips));
    }
  }, [trips]);

  // Save current trip ID to localStorage whenever it changes
  useEffect(() => {
    if (currentTrip) {
      localStorage.setItem('currentTripId', currentTrip.id);
    } else {
      localStorage.removeItem('currentTripId');
    }
  }, [currentTrip]);

  const createTrip = (
    title: string, 
    startDate: Date, 
    endDate: Date, 
    moodColor: MoodColor,
    description?: string,
    location?: string
  ) => {
    const newTrip: Trip = {
      id: uuidv4(),
      title,
      startDate,
      endDate,
      moodColor,
      description,
      location,
      stickers: [],
    };

    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    setCurrentTrip(newTrip);
    setCurrentDay(0);
    
    // Update theme if available
    if (theme?.setCurrentMoodColor) {
      theme.setCurrentMoodColor(moodColor);
    }
    
    // Ensure localStorage is updated
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
  };

  const selectTrip = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      setCurrentTrip(trip);
      setCurrentDay(0);
      
      // Update the theme if available
      if (theme?.setCurrentMoodColor) {
        theme.setCurrentMoodColor(trip.moodColor);
      }
      
      // Ensure the currentTripId is updated in localStorage
      localStorage.setItem('currentTripId', trip.id);
    }
  };

  const addSticker = (type: 'emoji' | 'image' | 'label', content: string) => {
    if (!currentTrip) return;

    const newSticker: Sticker = {
      id: uuidv4(),
      type,
      content,
      day: currentDay,
      position: {
        x: Math.random() * 300, // Random initial position
        y: Math.random() * 300,
      },
      size: {
        width: type === 'emoji' ? 60 : 150,
        height: type === 'emoji' ? 60 : 150,
      },
    };

    const updatedTrip = {
      ...currentTrip,
      stickers: [...currentTrip.stickers, newSticker],
    };

    const updatedTrips = trips.map((trip) => 
      trip.id === currentTrip.id ? updatedTrip : trip
    );

    setCurrentTrip(updatedTrip);
    setTrips(updatedTrips);
    
    // Ensure localStorage is updated
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
  };

  const updateStickerPosition = (stickerId: string, x: number, y: number) => {
    if (!currentTrip) return;

    const updatedStickers = currentTrip.stickers.map((sticker) =>
      sticker.id === stickerId
        ? { ...sticker, position: { x, y } }
        : sticker
    );

    const updatedTrip = {
      ...currentTrip,
      stickers: updatedStickers,
    };

    const updatedTrips = trips.map((trip) => 
      trip.id === currentTrip.id ? updatedTrip : trip
    );

    setCurrentTrip(updatedTrip);
    setTrips(updatedTrips);
    
    // Ensure localStorage is updated
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
  };

  const updateStickerSize = (stickerId: string, width: number, height: number) => {
    if (!currentTrip) return;

    const updatedStickers = currentTrip.stickers.map((sticker) =>
      sticker.id === stickerId
        ? { ...sticker, size: { width, height } }
        : sticker
    );

    const updatedTrip = {
      ...currentTrip,
      stickers: updatedStickers,
    };

    const updatedTrips = trips.map((trip) => 
      trip.id === currentTrip.id ? updatedTrip : trip
    );

    setCurrentTrip(updatedTrip);
    setTrips(updatedTrips);
    
    // Ensure localStorage is updated
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
  };

  const updateStickerContent = (stickerId: string, content: string) => {
    if (!currentTrip) return;

    const updatedStickers = currentTrip.stickers.map((sticker) =>
      sticker.id === stickerId
        ? { ...sticker, content }
        : sticker
    );

    const updatedTrip = {
      ...currentTrip,
      stickers: updatedStickers,
    };

    const updatedTrips = trips.map((trip) => 
      trip.id === currentTrip.id ? updatedTrip : trip
    );

    setCurrentTrip(updatedTrip);
    setTrips(updatedTrips);
    
    // Ensure localStorage is updated
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
  };

  const deleteSticker = (stickerId: string) => {
    if (!currentTrip) return;

    const updatedStickers = currentTrip.stickers.filter(
      (sticker) => sticker.id !== stickerId
    );

    const updatedTrip = {
      ...currentTrip,
      stickers: updatedStickers,
    };

    const updatedTrips = trips.map((trip) => 
      trip.id === currentTrip.id ? updatedTrip : trip
    );

    setCurrentTrip(updatedTrip);
    setTrips(updatedTrips);
    
    // Ensure localStorage is updated
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
  };

  const getTripDuration = () => {
    if (!currentTrip) return 0;
    const diffTime = Math.abs(
      currentTrip.endDate.getTime() - currentTrip.startDate.getTime()
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the first day
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        currentTrip,
        currentDay,
        createTrip,
        selectTrip,
        addSticker,
        updateStickerPosition,
        updateStickerSize,
        updateStickerContent,
        deleteSticker,
        setCurrentDay,
        getTripDuration,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};
