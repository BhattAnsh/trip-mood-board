import { useContext } from 'react';
import { TripContext } from '../contexts/TripContextValue';

// Custom hook to use the trip context
export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
