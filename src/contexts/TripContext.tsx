import React, { useContext } from 'react';
import { TripContext } from './TripContextValue';

// Internal helper to access the context, not exported to avoid circular dependencies
const useTripContextInternal = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('Trip context must be used within a TripProvider');
  }
  return context;
};

// We don't export anything else from this file
// The actual TripProvider is in TripProvider.tsx
// The actual useTrip hook is in hooks/use-trip.tsx
