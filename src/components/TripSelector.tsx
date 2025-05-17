import React from 'react';
import { useTrip } from '../hooks/use-trip';
import { useTheme } from '../hooks/use-theme';
import { format } from 'date-fns';
import { Trip } from '../types';
import { Map, ArrowRight } from 'lucide-react';

const TripSelector = () => {
  const { trips, currentTrip, selectTrip } = useTrip();
  const { getMoodColorHex, setCurrentMoodColor } = useTheme();

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-center animate-fade-in">
        <Map size={36} className="text-mood-color opacity-60 mb-3" />
        <p className="text-neo-text mb-3">You haven't created any trips yet</p>
        <div className="flex items-center text-mood-color text-sm font-medium">
          <span>Create your first trip below</span>
          <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    );
  }
  
  // Update the theme color when selecting a trip
  const handleTripSelect = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      selectTrip(tripId);
      setCurrentMoodColor(trip.moodColor);
    }
  };

  const formatTripDates = (trip: Trip) => {
    const start = format(trip.startDate, 'MMM d');
    const end = format(trip.endDate, 'MMM d, yyyy');
    return `${start} - ${end}`;
  };

  return (
    <div className="animate-fade-in w-full flex justify-center">
      <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto w-full">
        {trips.map((trip) => (
          <button
            key={trip.id}
            onClick={() => handleTripSelect(trip.id)}
            className={`text-left p-4 rounded-xl transition-all duration-200 w-full
              ${
                currentTrip?.id === trip.id
                  ? 'neo-mood-pressed'
                  : 'neo-flat hover:neo-mood-convex'
              }
            `}
          >
            <div className="flex flex-col items-center">
              <h3 className="font-medium text-lg" style={{ color: getMoodColorHex(trip.moodColor) }}>{trip.title}</h3>
              <p className="text-sm text-neo-text opacity-70">
                {formatTripDates(trip)}
              </p>
              <div
                className="w-full h-1 mt-2 rounded-full"
                style={{ backgroundColor: getMoodColorHex(trip.moodColor) }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TripSelector;
