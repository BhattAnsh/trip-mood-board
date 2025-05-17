import { MoodColor } from '../types';
import { moodColorValues } from '../contexts/ThemeContextValue';

// Utility function to get the hex color value for a mood
export const getMoodColorHex = (moodColor: MoodColor): string => {
  return moodColorValues[moodColor] || moodColorValues.blue;
};

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

// Generate rgba string with opacity for CSS
export const getRgbaColor = (moodColor: MoodColor, opacity: number): string => {
  const rgb = hexToRgb(getMoodColorHex(moodColor));
  return `rgba(${rgb}, ${opacity})`;
};
