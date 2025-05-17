import { MoodColor } from '../types';
import { createContext } from 'react';

// Define the color values for each mood
export const moodColorValues: Record<MoodColor, string> = {
  blue: '#60A5E6',
  green: '#60E6A5',
  purple: '#9B60E6',
  pink: '#E660A5',
  orange: '#E6A560'
};

// Define theme context type
export interface ThemeContextType {
  currentMoodColor: MoodColor;
  setCurrentMoodColor: (color: MoodColor) => void;
  getMoodColorHex: (color?: MoodColor) => string;
}

// Create the context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to convert hex to RGB
export const hexToRgb = (hex: string): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse r, g, b values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
};
