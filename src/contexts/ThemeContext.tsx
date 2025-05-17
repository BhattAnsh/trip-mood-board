import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import { MoodColor } from '../types';
import { ThemeContext, moodColorValues, hexToRgb } from './ThemeContextValue';

// Theme provider props interface
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentMoodColor, setCurrentMoodColor] = useState<MoodColor>('blue');

  // Function to get the hex color value for a mood
  const getMoodColorHex = useCallback((color?: MoodColor): string => {
    const moodColor = color || currentMoodColor;
    return moodColorValues[moodColor];
  }, [currentMoodColor]);

  // Update CSS variables whenever mood color changes
  useEffect(() => {
    console.log("Theme changed to:", currentMoodColor, getMoodColorHex(currentMoodColor));
    const hexColor = getMoodColorHex(currentMoodColor);
    const rgbValues = hexToRgb(hexColor);
    
    // Set base theme color variables
    document.documentElement.style.setProperty('--mood-color', hexColor);
    document.documentElement.style.setProperty('--mood-color-rgb', rgbValues);

    // Set derived theme colors for neomorphic effects - increased opacity for more visible effect
    document.documentElement.style.setProperty('--mood-color-light', `rgba(${rgbValues}, 0.08)`);
    document.documentElement.style.setProperty('--mood-color-bright', `rgba(${rgbValues}, 0.15)`);
    document.documentElement.style.setProperty('--mood-color-dark', `rgba(${rgbValues}, 0.25)`);

    // Update shadow color with theme influence - more visible
    document.documentElement.style.setProperty('--neo-shadow-dark-themed', `rgba(${rgbValues}, 0.25)`);
    
    // Update all neomorphic shadow variables - more defined shadows with larger size
    document.documentElement.style.setProperty('--neo-mood-shadow-flat', 
      `5px 5px 10px rgba(${rgbValues}, 0.25), -5px -5px 10px var(--neo-shadow-light)`);
    
    document.documentElement.style.setProperty('--neo-mood-shadow-pressed', 
      `inset 3px 3px 6px rgba(${rgbValues}, 0.25), inset -3px -3px 6px var(--neo-shadow-light)`);
    
    document.documentElement.style.setProperty('--neo-mood-shadow-convex', 
      `5px 5px 10px rgba(${rgbValues}, 0.25), -5px -5px 10px var(--neo-shadow-light), inset 1px 1px 2px var(--neo-shadow-light), inset -1px -1px 2px rgba(${rgbValues}, 0.15)`);
    
    // Update text color with theme influence
    document.documentElement.style.setProperty('--neo-text-theme', `rgba(${rgbValues}, 0.9)`);
  }, [currentMoodColor, getMoodColorHex]);

  const value = {
    currentMoodColor,
    setCurrentMoodColor,
    getMoodColorHex,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
