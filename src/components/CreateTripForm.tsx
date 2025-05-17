import React, { useState } from 'react';
import { useTrip } from '../hooks/use-trip';
import { useTheme } from '../hooks/use-theme';
import { MoodColor } from '../types';
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Paintbrush, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const CreateTripForm = () => {
  const { createTrip } = useTrip();
  const { getMoodColorHex, setCurrentMoodColor } = useTheme();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [moodColor, setMoodColor] = useState<MoodColor>('blue');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && startDate && endDate) {
      createTrip(title, startDate, endDate, moodColor);
      setTitle('');
      setStartDate(new Date());
      setEndDate(new Date());
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };
  
  // Apply the theme color immediately when selected in the form
  const handleColorChange = (color: MoodColor) => {
    setMoodColor(color);
    setCurrentMoodColor(color); // Apply to the global theme
  };

  const themeOptions: { color: MoodColor; name: string }[] = [
    { color: 'blue', name: 'Ocean Blue' },
    { color: 'green', name: 'Forest Green' },
    { color: 'purple', name: 'Lavender' },
    { color: 'pink', name: 'Rose Pink' },
    { color: 'orange', name: 'Sunset Orange' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-full mx-auto">
      <div className="space-y-2 flex flex-col items-center">
        <label htmlFor="title" className="block text-mood-color font-medium">
          Trip Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Manali Trip 2025"
          className="neo-input w-full focus:shadow-neo-mood-flat focus:outline-none transition-all duration-300"
          required
        />
      </div>

      <div className="space-y-3 flex flex-col items-center">
        <label htmlFor="dates" className="block text-mood-color font-medium">
          Trip Dates
        </label>
        
        <div className="flex flex-col items-center w-full">
          <div className="mb-2 text-sm font-medium text-neo-text text-center">
            {startDate ? format(startDate, "MMM d, yyyy") : "Start Date"}
          </div>
          <div className="neo-card p-2 rounded-xl w-full">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              className="neo-calendar"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center w-full mt-4">
          <div className="mb-2 text-sm font-medium text-neo-text text-center">
            {endDate ? format(endDate, "MMM d, yyyy") : "End Date"}
          </div>
          <div className="neo-card p-2 rounded-xl w-full">
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

      <div className="space-y-3 flex flex-col items-center">
        <label className="block text-mood-color font-medium flex items-center">
          <Paintbrush size={16} className="mr-2" /> Theme Color
        </label>
        <p className="text-sm text-center text-neo-text opacity-70">Choose a color that captures the mood of your journey</p>
        <RadioGroup 
          value={moodColor} 
          onValueChange={(value) => handleColorChange(value as MoodColor)}
          className="flex flex-wrap gap-4 justify-center mt-2"
        >
          {themeOptions.map((item) => (
            <div key={item.color} className="flex flex-col items-center">
              <div className="relative">
                <div 
                  className={`w-14 h-14 rounded-full transition-all duration-300 cursor-pointer
                    ${moodColor === item.color 
                      ? 'scale-110 shadow-neo-pressed transform-gpu' 
                      : 'hover:scale-105 shadow-neo-convex'
                    }
                  `}
                  style={{ 
                    backgroundColor: getMoodColorHex(item.color),
                    boxShadow: moodColor === item.color 
                      ? 'inset 2px 2px 5px rgba(0, 0, 0, 0.15), inset -2px -2px 5px rgba(255, 255, 255, 0.7)'
                      : '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  {moodColor === item.color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
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
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="neo-button w-full bg-neo-bg text-mood-color font-medium text-lg transition-all duration-300 hover:shadow-neo-mood-convex active:shadow-neo-mood-pressed"
        >
          <Map size={18} className="mr-2 inline-block" /> Create Trip
        </button>
      </div>
      
      {showSuccess && (
        <div 
          className="neo-mood-flat mt-4 p-3 text-center animate-fade-in rounded-lg"
        >
          <p className="text-sm font-medium text-mood-color">
            Trip created successfully!
          </p>
        </div>
      )}
    </form>
  );
};

export default CreateTripForm;
