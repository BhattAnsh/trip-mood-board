import React from 'react';
import { useTheme } from '../hooks/use-theme';
import { MoodColor } from '../types';
import { Check } from 'lucide-react';
import { hexToRgb } from '../contexts/ThemeContextValue';

const ThemeColorSelector = () => {
  const { currentMoodColor, setCurrentMoodColor, getMoodColorHex } = useTheme();

  const themeOptions: { color: MoodColor; name: string }[] = [
    { color: 'blue', name: 'Ocean Blue' },
    { color: 'green', name: 'Forest Green' },
    { color: 'purple', name: 'Lavender' },
    { color: 'pink', name: 'Rose Pink' },
    { color: 'orange', name: 'Sunset Orange' },
  ];

  const handleColorChange = (color: MoodColor) => {
    console.log("Selected theme color:", color);
    setCurrentMoodColor(color);
    
    // Update active UI immediately with new color
    const hexColor = getMoodColorHex(color);
    const rgbValues = hexToRgb(hexColor);
    
    // Set base theme color variables
    document.documentElement.style.setProperty('--mood-color', hexColor);
    document.documentElement.style.setProperty('--mood-color-rgb', rgbValues);

    // Set derived theme colors for neomorphic effects - enhanced for Apple UI
    document.documentElement.style.setProperty('--mood-color-light', `rgba(${rgbValues}, 0.08)`);
    document.documentElement.style.setProperty('--mood-color-bright', `rgba(${rgbValues}, 0.15)`);
    document.documentElement.style.setProperty('--mood-color-dark', `rgba(${rgbValues}, 0.25)`);

    // Update shadow color with theme influence - enhanced
    document.documentElement.style.setProperty('--neo-shadow-dark-themed', `rgba(${rgbValues}, 0.2)`);
    
    // Update all neomorphic shadow variables - Apple-like shadows
    document.documentElement.style.setProperty('--neo-mood-shadow-flat', 
      `6px 6px 12px rgba(${rgbValues}, 0.2), -6px -6px 12px var(--neo-shadow-light)`);
    
    document.documentElement.style.setProperty('--neo-mood-shadow-pressed', 
      `inset 4px 4px 8px rgba(${rgbValues}, 0.2), inset -4px -4px 8px var(--neo-shadow-light)`);
    
    document.documentElement.style.setProperty('--neo-mood-shadow-convex', 
      `6px 6px 12px rgba(${rgbValues}, 0.2), -6px -6px 12px var(--neo-shadow-light), inset 1px 1px 2px var(--neo-shadow-light), inset -1px -1px 2px rgba(${rgbValues}, 0.15)`);
      
    // Update text color with theme influence
    document.documentElement.style.setProperty('--neo-text-theme', `rgba(${rgbValues}, 0.9)`);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-3 text-mood-color">Customize Theme</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {themeOptions.map((option) => {
          const isSelected = currentMoodColor === option.color;
          return (
            <button
              key={option.color}
              onClick={() => handleColorChange(option.color)}
              className={`p-3 aspect-square flex flex-col items-center justify-center relative transition-all duration-200 rounded-xl overflow-hidden ${isSelected ? 'translate-y-0.5' : 'hover:-translate-y-0.5'}`}
              style={{ 
                background: 'var(--neo-bg-tinted)',
                boxShadow: isSelected 
                  ? 'var(--neo-mood-shadow-pressed)' 
                  : 'var(--neo-shadow-flat)',
                border: isSelected 
                  ? `1px solid rgba(${hexToRgb(getMoodColorHex(option.color))}, 0.3)` 
                  : '1px solid rgba(255, 255, 255, 0.8)'
              }}
            >
              <div 
                className={`w-12 h-12 rounded-full mb-2 shadow-lg flex items-center justify-center ${isSelected ? 'scale-105' : ''}`}
                style={{ 
                  backgroundColor: getMoodColorHex(option.color),
                  boxShadow: `0 4px 8px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(255, 255, 255, 0.3) inset`,
                }}
              >
                {isSelected && (
                  <Check size={16} className="text-white drop-shadow-sm" />
                )}
              </div>
              <span className={`text-sm mt-1 font-medium transition-colors ${isSelected ? 'text-mood-color' : 'text-neo-text'}`}>
                {option.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeColorSelector;
