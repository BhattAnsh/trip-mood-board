
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Trip, Sticker, MoodColor } from '../types';
import { v4 as uuidv4 } from 'uuid';
// Import the ThemeContext and useTheme
import { ThemeContext } from './ThemeContextValue';
import { useTheme } from '../hooks/use-theme';

interface TripContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  currentDay: number;
  createTrip: (title: string, startDate: Date, endDate: Date, moodColor: MoodColor) => void;
  selectTrip: (tripId: string) => void;
  addSticker: (type: 'emoji' | 'image' | 'label', content: string) => void;
  updateStickerPosition: (stickerId: string, x: number, y: number) => void;
  updateStickerSize: (stickerId: string, width: number, height: number) => void;
  deleteSticker: (stickerId: string) => void;
  setCurrentDay: (day: number) => void;
  getTripDuration: () => number;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider = ({ children }: TripProviderProps) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [currentDay, setCurrentDay] = useState<number>(0);
  
  // Use the theme hook 
  const theme = useTheme();

  const createTrip = (title: string, startDate: Date, endDate: Date, moodColor: MoodColor) => {
    const newTrip: Trip = {
      id: uuidv4(),
      title,
      startDate,
      endDate,
      moodColor,
      stickers: [],
    };

    setTrips([...trips, newTrip]);
    setCurrentTrip(newTrip);
    setCurrentDay(0);
  };

  const selectTrip = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      setCurrentTrip(trip);
      setCurrentDay(0);
      
      // Update the mood color in the theme context if it's available
      if (theme && theme.setCurrentMoodColor) {
        theme.setCurrentMoodColor(trip.moodColor);
      }
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

    setCurrentTrip(updatedTrip);
    setTrips(
      trips.map((trip) => (trip.id === currentTrip.id ? updatedTrip : trip))
    );
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

    setCurrentTrip(updatedTrip);
    setTrips(
      trips.map((trip) => (trip.id === currentTrip.id ? updatedTrip : trip))
    );
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

    setCurrentTrip(updatedTrip);
    setTrips(
      trips.map((trip) => (trip.id === currentTrip.id ? updatedTrip : trip))
    );
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

    setCurrentTrip(updatedTrip);
    setTrips(
      trips.map((trip) => (trip.id === currentTrip.id ? updatedTrip : trip))
    );
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
        deleteSticker,
        setCurrentDay,
        getTripDuration,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};
