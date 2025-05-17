import React from 'react';
import { useTrip } from '../hooks/use-trip';
import { useTheme } from '../hooks/use-theme';
import { Trip } from '../types';
import { format } from 'date-fns';
import { Navigate, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Globe } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
}

const TripCard = ({ trip }: TripCardProps) => {
  const { selectTrip } = useTrip();
  const { getMoodColorHex } = useTheme();
  const navigate = useNavigate();

  const handleTripSelect = () => {
    selectTrip(trip.id);
    navigate('/app');
  };

  const formatTripDates = (trip: Trip) => {
    const start = format(trip.startDate, 'MMM d');
    const end = format(trip.endDate, 'MMM d, yyyy');
    return `${start} - ${end}`;
  };

  const duration = () => {
    const diffTime = Math.abs(
      trip.endDate.getTime() - trip.startDate.getTime()
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div 
      className="shadow-neo-card rounded-xl bg-neo-bg overflow-hidden transition-all duration-300 hover:shadow-neo-card-hover cursor-pointer"
      onClick={handleTripSelect}
    >
      <div className="p-6">
        <div 
          className="h-2 rounded-full mb-4" 
          style={{ backgroundColor: getMoodColorHex(trip.moodColor) }}
        />
        
        <h3 
          className="text-xl font-bold mb-2" 
          style={{ color: getMoodColorHex(trip.moodColor) }}
        >
          {trip.title}
        </h3>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center text-neo-text">
            <Calendar size={14} className="mr-2 opacity-70 flex-shrink-0" />
            <span className="text-sm">{formatTripDates(trip)}</span>
          </div>
          
          <div className="flex items-center text-neo-text">
            <MapPin size={14} className="mr-2 opacity-70 flex-shrink-0" />
            <span className="text-sm">{duration()} days</span>
          </div>
          
          {trip.location && (
            <div className="flex items-center text-neo-text">
              <Globe size={14} className="mr-2 opacity-70 flex-shrink-0" />
              <span className="text-sm truncate">{trip.location}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-neo-border">
          <span 
            className="inline-block px-3 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: `${getMoodColorHex(trip.moodColor)}20`,
              color: getMoodColorHex(trip.moodColor)
            }}
          >
            {trip.stickers.length} memories
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripCard; 