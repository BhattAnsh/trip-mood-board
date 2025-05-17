import React from 'react';
import { useTheme } from '../hooks/use-theme';
import { MapPin, Calendar, Image, PlusCircle, Music, Clock, Map } from 'lucide-react';
import { MoodColor } from '../types';
import { format } from 'date-fns';

interface TripPreviewProps {
  moodColor: MoodColor;
  title?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  description?: string;
}

const TripPreview = ({ 
  moodColor, 
  title = "Trip Preview", 
  startDate, 
  endDate,
  location,
  description
}: TripPreviewProps) => {
  const { getMoodColorHex } = useTheme();
  
  // Get the color for the preview
  const colorHex = getMoodColorHex(moodColor);
  const formatDate = (date?: Date) => date ? format(date, 'MMM d, yyyy') : 'Select date';
  
  // Calculate trip duration if both dates are set
  const getDuration = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return null;
  };
  
  const duration = getDuration();
  
  return (
    <div className="shadow-neo-card rounded-xl bg-neo-bg overflow-hidden transition-all duration-200 hover:shadow-neo-card-hover h-full">
      <div className="p-4 flex flex-col h-full">
        {/* Preview Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 
            className="text-lg font-bold line-clamp-1" 
            style={{ color: colorHex }}
          >
            {title || "Trip Preview"}
          </h3>
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: colorHex }}
          />
        </div>
        
        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div 
            className="text-xs rounded-lg p-2 flex items-center"
            style={{ backgroundColor: `${colorHex}10` }}
          >
            <Calendar size={14} className="mr-1" style={{ color: colorHex }} />
            <div className="flex flex-col">
              <span style={{ color: colorHex }}>Start</span>
              <span className="font-medium">{formatDate(startDate)}</span>
            </div>
          </div>
          
          <div 
            className="text-xs rounded-lg p-2 flex items-center"
            style={{ backgroundColor: `${colorHex}10` }}
          >
            <Calendar size={14} className="mr-1" style={{ color: colorHex }} />
            <div className="flex flex-col">
              <span style={{ color: colorHex }}>End</span>
              <span className="font-medium">{formatDate(endDate)}</span>
            </div>
          </div>
        </div>
        
        {/* Location */}
        {location && (
          <div 
            className="text-xs rounded-lg p-2 flex items-center mb-3"
            style={{ backgroundColor: `${colorHex}10` }}
          >
            <MapPin size={14} className="mr-1 flex-shrink-0" style={{ color: colorHex }} />
            <div className="flex flex-col">
              <span style={{ color: colorHex }}>Location</span>
              <span className="font-medium line-clamp-1">{location}</span>
            </div>
          </div>
        )}
        
        {/* Description Preview */}
        {description && (
          <div className="text-xs mb-3 px-2">
            <p className="line-clamp-2 text-neo-text">{description}</p>
          </div>
        )}
        
        {/* Map placeholder */}
        <div className="relative rounded-lg overflow-hidden mb-3 flex-1 min-h-[100px] border border-neo-border">
          <div className="absolute inset-0 bg-gradient-to-b from-[#e6e9ef] to-[#d4dae6] flex items-center justify-center">
            <Map 
              size={24} 
              className="text-black opacity-20"
            />
          </div>
          
          {/* Destination pin */}
          {location && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center animate-bounce-slow"
                style={{ backgroundColor: colorHex }}
              >
                <MapPin size={16} className="text-white" />
              </div>
            </div>
          )}
          
          {/* Location label */}
          {location && (
            <div 
              className="absolute bottom-2 left-2 right-2 rounded-lg bg-white bg-opacity-80 p-2 text-xs"
            >
              <span className="font-medium" style={{ color: colorHex }}>{location}</span>
              {duration && (
                <div className="flex items-center mt-1">
                  <Clock size={10} className="mr-1" style={{ color: colorHex }} />
                  <span className="text-neo-text">{duration} days</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Mini canvas preview */}
        <div 
          className="rounded-lg overflow-hidden relative border border-neo-border"
          style={{ backgroundColor: `${colorHex}10`, height: '80px' }}
        >
          {/* Preview stickers */}
          <div className="absolute top-2 left-2 shadow-neo-flat p-1 rounded-lg bg-white">
            <Image size={16} style={{ color: colorHex }} />
          </div>
          
          <div 
            className="absolute top-1/3 right-1/4 shadow-neo-flat px-2 py-1 rounded-lg bg-white flex items-center"
          >
            <MapPin size={12} className="mr-1" style={{ color: colorHex }} />
            <span className="text-[10px]" style={{ color: colorHex }}>
              {location ? location.split(',')[0] : "Location"}
            </span>
          </div>
          
          <div 
            className="absolute bottom-3 left-3 shadow-neo-flat px-2 py-1 rounded-lg bg-white"
          >
            <Calendar size={14} style={{ color: colorHex }} />
          </div>
          
          <div 
            className="absolute bottom-1/4 right-2 shadow-neo-flat p-1 rounded-lg bg-white text-lg"
          >
            🌴
          </div>
        </div>
        
        {/* Preview controls */}
        <div className="mt-3 flex justify-between">
          <div 
            className="w-8 h-8 shadow-neo-flat rounded-full flex items-center justify-center"
            style={{ borderColor: `${colorHex}30` }}
          >
            <PlusCircle size={14} style={{ color: colorHex }} />
          </div>
          
          <div 
            className="w-20 h-6 shadow-neo-flat rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colorHex}15` }}
          >
            <div className="w-full h-1 rounded-full mx-2" style={{ backgroundColor: colorHex }}></div>
          </div>
          
          <div 
            className="w-8 h-8 shadow-neo-flat rounded-full flex items-center justify-center"
            style={{ borderColor: `${colorHex}30` }}
          >
            <Music size={14} style={{ color: colorHex }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPreview; 