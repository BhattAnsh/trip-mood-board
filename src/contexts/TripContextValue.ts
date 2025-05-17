import { createContext } from 'react';
import { Trip, MoodColor } from '../types';

// Define trip context type
export interface TripContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  currentDay: number;
  createTrip: (
    title: string, 
    startDate: Date, 
    endDate: Date, 
    moodColor: MoodColor,
    description?: string,
    location?: string
  ) => void;
  selectTrip: (tripId: string) => void;
  addSticker: (type: 'emoji' | 'image' | 'label', content: string) => void;
  updateStickerPosition: (stickerId: string, x: number, y: number) => void;
  updateStickerSize: (stickerId: string, width: number, height: number) => void;
  updateStickerContent: (stickerId: string, content: string) => void;
  deleteSticker: (stickerId: string) => void;
  setCurrentDay: (day: number) => void;
  getTripDuration: () => number;
}

// Create the context
export const TripContext = createContext<TripContextType | undefined>(undefined);
