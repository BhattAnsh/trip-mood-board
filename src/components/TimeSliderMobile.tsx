import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTrip } from '../hooks/use-trip';
import { useTheme } from '../hooks/use-theme';
import { format, addDays } from 'date-fns';
import { Radio, Play, Pause } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

// This is a simplified version of TimeSlider for mobile screens
const TimeSliderMobile = () => {
  const { currentTrip, currentDay, setCurrentDay } = useTrip();
  const { getMoodColorHex } = useTheme();
  
  // Calculate trip duration from startDate and endDate
  const getTripDuration = useCallback(() => {
    if (!currentTrip) return 1;
    const diffTime = Math.abs(
      currentTrip.endDate.getTime() - currentTrip.startDate.getTime()
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start day
  }, [currentTrip]);
  
  const duration = getTripDuration();
  
  const [isGlowing, setIsGlowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedDay, setDraggedDay] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Additional state for radio tuning effect
  const [tuningNoise, setTuningNoise] = useState(false);
  
  // Animation state for the Day badge
  const [dayBadgeAnimating, setDayBadgeAnimating] = useState(false);

  const formatDay = useCallback((dayNumber: number) => {
    if (!currentTrip || dayNumber < 0 || dayNumber >= duration) return "";
    const date = addDays(new Date(currentTrip.startDate), dayNumber);
    return format(date, 'MMM d');
  }, [currentTrip, duration]);

  const getProgressPercentage = useCallback((dayToCalculate: number) => {
    if (duration <= 1) return 100;
    if (duration > 1 && dayToCalculate === duration - 1) return 100;
    return (dayToCalculate / (duration - 1)) * 100;
  }, [duration]);

  // Track illumination
  const trackSpring = useSpring({
    width: `${getProgressPercentage(currentDay)}%`,
  });

  // Day badge animation
  const dayBadgeSpring = useSpring({
    scale: dayBadgeAnimating ? 1.1 : 1,
    opacity: dayBadgeAnimating ? 0 : 1,
    config: { tension: 300, friction: 10 },
    onRest: () => {
      if (dayBadgeAnimating) {
        setDayBadgeAnimating(false);
      }
    }
  });
  
  // Add glowing effect when tuning
  useEffect(() => {
    if (isDragging || tuningNoise) {
      setIsGlowing(true);
    } else {
      const timer = setTimeout(() => setIsGlowing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isDragging, tuningNoise]);
  
  // Playback auto-advance effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTrip && duration > 1) {
      interval = setInterval(() => {
        setTuningNoise(true);
        setTimeout(() => setTuningNoise(false), 300);
        
        const nextDay = currentDay + 1;
        if (nextDay >= duration) {
          setCurrentDay(duration - 1);
          setIsPlaying(false);
        } else {
          setCurrentDay(nextDay);
        }
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrip, duration, setCurrentDay, currentDay]);

  // Stop playback when day is manually changed
  useEffect(() => {
    if (currentDay !== draggedDay) {
      setIsPlaying(false);
    }
  }, [currentDay, draggedDay]);

  // Animate the Day badge when day changes
  useEffect(() => {
    setDayBadgeAnimating(true);
  }, [currentDay]);
  
  if (!currentTrip) return null;

  const handlePlayPause = () => {
    if (duration <= 1) return;
    setIsPlaying(!isPlaying);
  };

  const calculateDayFromPosition = (clientX: number): number => {
    if (!trackRef.current) return currentDay;
    const rect = trackRef.current.getBoundingClientRect();
    const clickPosition = clientX - rect.left;
    let percentage = clickPosition / rect.width;
    percentage = Math.max(0, Math.min(1, percentage));
    return Math.round(percentage * (duration - 1));
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 1) return;
    const newDay = calculateDayFromPosition(e.clientX);
    setTuningNoise(true);
    setTimeout(() => setTuningNoise(false), 300);
    setCurrentDay(newDay);
  };

  const handleDragStart = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 1 || !trackRef.current) return;
    setIsDragging(true);
    setDraggedDay(currentDay);
    setTuningNoise(true);

    const getClientX = (event: TouchEvent | MouseEvent) => 
      'touches' in event ? event.touches[0].clientX : event.clientX;

    const handleMove = (moveEvent: TouchEvent | MouseEvent) => {
      const newVisualDay = calculateDayFromPosition(getClientX(moveEvent));
      if (newVisualDay !== draggedDay) {
        setTuningNoise(true);
        setTimeout(() => {
          if (!isDragging) setTuningNoise(false);
        }, 100);
      }
      setDraggedDay(newVisualDay);
    };

    const handleEnd = (upEvent: TouchEvent | MouseEvent) => {
      setIsDragging(false);
      setTuningNoise(false);
      const finalDay = calculateDayFromPosition(getClientX(upEvent));
      
      // Simplify snap logic for touch interfaces
      const dayToSet = Math.round(finalDay);
      setCurrentDay(Math.max(0, Math.min(dayToSet, duration - 1)));
      setDraggedDay(null);

      document.removeEventListener('mousemove', handleMove as EventListener);
      document.removeEventListener('mouseup', handleEnd as EventListener);
      document.removeEventListener('touchmove', handleMove as EventListener);
      document.removeEventListener('touchend', handleEnd as EventListener);
    };

    document.addEventListener('mousemove', handleMove as EventListener);
    document.addEventListener('mouseup', handleEnd as EventListener);
    document.addEventListener('touchmove', handleMove as EventListener, { passive: false });
    document.addEventListener('touchend', handleEnd as EventListener);
  };

  // Simplified day display for mobile
  const renderDayDisplay = () => {
    const dayLabel = formatDay(currentDay);
    
    return (
      <div className="w-full text-center">
        <animated.div 
          className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 text-mood-color py-1 px-3 ${isGlowing ? 'radio-display-glow' : ''}`}
          style={{
            ...dayBadgeSpring,
            background: 'linear-gradient(145deg, rgba(var(--mood-color-rgb), 0.15), rgba(var(--mood-color-rgb), 0.25))',
            border: `1px solid rgba(var(--mood-color-rgb), 0.3)`,
            fontSize: '0.9rem',
          }}
        >
          {duration > 1 ? (
            <>
              <span className="font-medium radio-digit flex items-center text-xs">
                DAY {currentDay + 1}
              </span>
              <span className="radio-date-separator mx-1 opacity-80">|</span>
              <span className="font-medium radio-digit text-xs uppercase">
                {dayLabel}
              </span>
            </>
          ) : (
            <span className="font-medium radio-digit text-xs uppercase">
              {dayLabel}
            </span>
          )}
        </animated.div>
      </div>
    );
  };

  return (
    <div className="w-full h-full py-1 px-1 animate-fade-in select-none flex flex-col">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xs font-semibold flex items-center gap-1 text-mood-color">
          <Radio size={10} className="opacity-80" />
          <span>Trip Days</span>
        </h2>
        
        <button
          onClick={handlePlayPause}
          disabled={duration <= 1}
          className={`p-1 rounded-full h-5 w-5 flex items-center justify-center transition-colors ${
            isPlaying ? 'text-mood-color' : 'text-neo-text'
          }`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={10} /> : <Play size={10} />}
        </button>
      </div>

      {/* Simplified track for mobile */}
      <div
        ref={trackRef}
        className="relative w-full h-4 cursor-pointer rounded-full overflow-hidden mb-2 touch-manipulation"
        onClick={handleTrackClick}
        onTouchStart={handleDragStart}
        style={{
          background: 'rgba(var(--mood-color-rgb), 0.1)',
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
          touchAction: 'none'
        }}
      >
        <animated.div
          className="absolute top-0 left-0 h-full"
          style={{
            ...trackSpring,
            background: 'rgba(var(--mood-color-rgb), 0.3)',
          }}
        />

        {/* Circle indicator for current position */}
        <div
          className={`absolute top-0 h-full aspect-square rounded-full z-10 transition-all ${isGlowing ? 'glow' : ''}`}
          style={{
            left: `calc(${getProgressPercentage(currentDay)}% - 8px)`,
            backgroundColor: 'var(--mood-color)',
            boxShadow: isGlowing ? '0 0 5px var(--mood-color)' : 'none',
            transform: 'translateY(-50%)',
            top: '50%',
            width: '16px',
            height: '16px',
            border: '2px solid white',
          }}
        />
      </div>

      {/* Day markers - simplified for mobile */}
      <div className="relative w-full flex justify-between text-[8px] mb-2 text-mood-color">
        {Array.from({ length: Math.min(duration, 7) }).map((_, idx) => {
          const day = Math.floor(idx * (duration / Math.min(duration, 7)));
          return (
            <div 
              key={idx} 
              className="flex flex-col items-center"
              onClick={() => {
                setTuningNoise(true);
                setTimeout(() => setTuningNoise(false), 300);
                setCurrentDay(day);
              }}
            >
              <div 
                className={`h-1.5 w-1.5 rounded-full transition-all duration-200 cursor-pointer
                  ${currentDay === day ? 'bg-mood-color' : 'bg-mood-color/40'}
                `}
              />
              <span className={`cursor-pointer ${currentDay === day ? 'font-medium' : 'opacity-70'}`}>
                {day + 1}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex items-center justify-center mt-auto">
        {renderDayDisplay()}
      </div>
    </div>
  );
};

export default TimeSliderMobile;
