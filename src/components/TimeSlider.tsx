import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTrip } from '../hooks/use-trip';
import { useTheme } from '../hooks/use-theme';
import { format, addDays } from 'date-fns';
import { Play, Pause, Speaker, Volume2, Radio, Info } from 'lucide-react';
import { useSpring, animated, config as springConfig } from '@react-spring/web';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from '../hooks/use-mobile';

const TimeSlider = () => {
  const { currentTrip, currentDay, setCurrentDay, getTripDuration, setDayCount } = useTrip();
  const { getMoodColorHex } = useTheme();
  const isMobile = useIsMobile();
  const [hasInitialAnimation, setHasInitialAnimation] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTimelineDot, setActiveTimelineDot] = useState<number | null>(null);
  const duration = currentTrip?.duration || 1;
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [draggedDay, setDraggedDay] = useState<number | null>(null);
  
  // Additional state for radio tuning effect
  const [tuningNoise, setTuningNoise] = useState(false);
  const [lastTunedDay, setLastTunedDay] = useState<number>(currentDay);
  const [showDisplay, setShowDisplay] = useState(true);
  
  // Skip rendering on mobile - it's already filtered in the Index component, but this is a safeguard
  if (isMobile) return null;
  
  const [knobRotation, setKnobRotation] = useState(0);
  const [knobDragging, setKnobDragging] = useState(false);
  const [knobStartAngle, setKnobStartAngle] = useState(0);
  
  // Animation state for the Day badge
  const [dayBadgeAnimating, setDayBadgeAnimating] = useState(false);

  const formatDay = useCallback((dayNumber: number) => {
    if (!currentTrip || dayNumber < 0 || dayNumber >= duration) return "";
    const date = addDays(new Date(currentTrip.startDate), dayNumber);
    return format(date, 'MMM d');
  }, [currentTrip, duration]);

  const MAX_MARKERS = 14; // Increased for radio dial feel
  const MIN_MARKERS_FOR_SPACING = 7;

  const generatedTimelineMarkers = useCallback(() => {
    if (!currentTrip || duration <= 0) return [{ day: 0, label: formatDay(0) }];
    if (duration === 1) return [{ day: 0, label: formatDay(0) }];

    const markersArray: { day: number; label: string }[] = [];

    if (duration <= MAX_MARKERS) {
      for (let i = 0; i < duration; i++) {
        markersArray.push({ day: i, label: formatDay(i) });
      }
    } else {
      markersArray.push({ day: 0, label: formatDay(0) });
      const numIntermediateMarkers = Math.min(duration - 2, MAX_MARKERS - 2);
      const step = (duration - 1) / (numIntermediateMarkers + 1);
      
      for (let i = 1; i <= numIntermediateMarkers; i++) {
        const day = Math.round(i * step);
        if (!markersArray.find(m => m.day === day) && day < duration - 1 && day > 0) {
          markersArray.push({ day: day, label: formatDay(day) });
        }
      }
      
      markersArray.push({ day: duration - 1, label: formatDay(duration - 1) });
      
      const uniqueSortedMarkers = [...new Map(markersArray.map(item => [item.day, item])).values()]
                                 .sort((a, b) => a.day - b.day);
      
      return uniqueSortedMarkers;
    }
    return markersArray;
  }, [duration, currentTrip, formatDay]);

  const getProgressPercentage = useCallback((dayToCalculate: number) => {
    if (duration <= 1) return 100;
    if (duration > 1 && dayToCalculate === duration - 1) return 100;
    return (dayToCalculate / (duration - 1)) * 100;
  }, [duration]);

  const springApiConfig = isDragging ? springConfig.stiff : springConfig.default;

  // Use spring for dial rotation instead of left position
  const dialRotation = useSpring({
    rotation: getProgressPercentage(draggedDay ?? currentDay) * 1.8, // 180 degrees total rotation
    config: springApiConfig,
  });

  // Knob rotation spring with improved rotation feel
  const knobSpring = useSpring({
    rotation: knobRotation,
    config: {
      tension: 120,
      friction: 14,
      mass: 1
    },
  });

  // Needle position spring
  const needleSpring = useSpring({
    left: `${getProgressPercentage(draggedDay ?? currentDay)}%`,
    config: springApiConfig,
  });

  // Track illumination
  const trackSpring = useSpring({
    width: `${getProgressPercentage(currentDay)}%`,
    config: springConfig.default,
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

  useEffect(() => {
    if (currentDay !== draggedDay) {
      setIsPlaying(false);
    }
  }, [currentDay, draggedDay]);

  // Animate the Day badge when day changes
  useEffect(() => {
    setDayBadgeAnimating(true);
  }, [currentDay]);

  // Update knob rotation when day changes
  useEffect(() => {
    setKnobRotation(currentDay * (360 / Math.max(duration, 1)));
  }, [currentDay, duration]);

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

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (duration <= 1 || !trackRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    setDraggedDay(currentDay);
    setTuningNoise(true);

    const getClientX = (event: MouseEvent | TouchEvent) => 'touches' in event ? event.touches[0].clientX : event.clientX;

    const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      const newVisualDay = calculateDayFromPosition(getClientX(moveEvent));
      if (newVisualDay !== draggedDay) {
        setTuningNoise(true);
        setTimeout(() => {
          if (!isDragging) setTuningNoise(false);
        }, 100);
      }
      setDraggedDay(newVisualDay);
    };

    const handleMouseUp = (upEvent: MouseEvent | TouchEvent) => {
      setIsDragging(false);
      setTuningNoise(false);
      const finalDay = calculateDayFromPosition(getClientX(upEvent));
      
      const dayFraction = finalDay - Math.floor(finalDay);
      let dayToSet = finalDay;
      
      const dragEndPoint = getClientX(upEvent);
      let initialDragPoint = 0;
      if(e.type === 'mousedown') initialDragPoint = (e as React.MouseEvent<HTMLDivElement>).clientX;
      if(e.type === 'touchstart') initialDragPoint = (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX;
      
      const direction = dragEndPoint > initialDragPoint ? 'right' : 'left';
      const SNAP_THRESHOLD = 0.3;

      // Simplify logic for consistent behavior in both directions
      if (dayFraction > 0.5 && finalDay < duration - 1) {
        dayToSet = Math.ceil(finalDay);
      } else if (dayFraction < 0.5 && finalDay > 0) {
        dayToSet = Math.floor(finalDay);
      } else {
        dayToSet = Math.round(finalDay);
      }

      setCurrentDay(Math.max(0, Math.min(dayToSet, duration - 1)));
      setDraggedDay(null);

      document.removeEventListener('mousemove', handleMouseMove as EventListener);
      document.removeEventListener('mouseup', handleMouseUp as EventListener);
      document.removeEventListener('touchmove', handleMouseMove as EventListener);
      document.removeEventListener('touchend', handleMouseUp as EventListener);
    };

    document.addEventListener('mousemove', handleMouseMove as EventListener);
    document.addEventListener('mouseup', handleMouseUp as EventListener);
    document.addEventListener('touchmove', handleMouseMove as EventListener, { passive: false });
    document.addEventListener('touchend', handleMouseUp as EventListener);
  };

  // Handle knob rotation directly
  const handleKnobDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (duration <= 1) return;
    e.preventDefault();
    setKnobDragging(true);
    setTuningNoise(true);
    
    const knobElement = knobRef.current;
    if (!knobElement) return;
    
    const knobRect = knobElement.getBoundingClientRect();
    const knobCenterX = knobRect.left + knobRect.width / 2;
    const knobCenterY = knobRect.top + knobRect.height / 2;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const startAngle = Math.atan2(clientY - knobCenterY, clientX - knobCenterX) * (180 / Math.PI);
    setKnobStartAngle(startAngle);
    
    const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      const moveClientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveClientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      
      const currentAngle = Math.atan2(moveClientY - knobCenterY, moveClientX - knobCenterX) * (180 / Math.PI);
      let rotation = (currentAngle - knobStartAngle + knobRotation) % 360;
      
      // Normalize rotation to 0-360
      if (rotation < 0) rotation += 360;
      
      // Calculate day based on rotation
      const newDay = Math.round((rotation / 360) * duration) % duration;
      
      if (newDay !== currentDay) {
        setTuningNoise(true);
        setTimeout(() => {
          if (!knobDragging) setTuningNoise(false);
        }, 100);
        setCurrentDay(newDay);
      }
      
      setKnobRotation(rotation);
    };
    
    const handleMouseUp = () => {
      setKnobDragging(false);
      setTuningNoise(false);
      
      document.removeEventListener('mousemove', handleMouseMove as EventListener);
      document.removeEventListener('mouseup', handleMouseUp as EventListener);
      document.removeEventListener('touchmove', handleMouseMove as EventListener);
      document.removeEventListener('touchend', handleMouseUp as EventListener);
    };
    
    document.addEventListener('mousemove', handleMouseMove as EventListener);
    document.addEventListener('mouseup', handleMouseUp as EventListener);
    document.addEventListener('touchmove', handleMouseMove as EventListener, { passive: false });
    document.addEventListener('touchend', handleMouseUp as EventListener);
  };

  // Handle timeline dot click
  const handleTimelineDotClick = (day: number) => {
    if (day === currentDay) return;
    setTuningNoise(true);
    setTimeout(() => setTuningNoise(false), 300);
    setActiveTimelineDot(day);
    setTimeout(() => setActiveTimelineDot(null), 500);
    setCurrentDay(day);
  };

  if (!currentTrip) return null;

  const timelineDisplayMarkers = generatedTimelineMarkers();

  const renderDayDisplay = () => {
    const dayLabel = formatDay(currentDay);
    
    // Use optional trip properties for icons
    // Choose an icon based on trip description or location
    const getTripIcon = () => {
      const description = currentTrip.description?.toLowerCase() || '';
      const location = currentTrip.location?.toLowerCase() || '';
      
      if (description.includes('beach') || location.includes('beach') || 
          description.includes('ocean') || location.includes('ocean')) return '🏖️';
      if (description.includes('mountain') || location.includes('mountain') || 
          description.includes('hiking') || location.includes('trek')) return '🏔️';
      if (description.includes('city') || location.includes('city') || 
          description.includes('urban')) return '🏙️';
      if (description.includes('forest') || location.includes('forest') || 
          description.includes('camping')) return '🌲';
      return '';
    };
    
    const tripIcon = getTripIcon();
    
    return (
      <div className="mt-6 text-center">
        <animated.div 
          className={`inline-flex items-center justify-center space-x-2 rounded-xl transition-all duration-200 text-mood-color py-3 px-6 shadow-md ${isGlowing ? 'radio-display-glow' : ''}`}
          style={{
            ...dayBadgeSpring,
            background: 'linear-gradient(145deg, rgba(var(--mood-color-rgb), 0.15), rgba(var(--mood-color-rgb), 0.25))',
            border: `1px solid rgba(var(--mood-color-rgb), 0.3)`,
            fontFamily: "'VT323', monospace",
            fontSize: '1.35rem'
          }}
        >
          {duration > 1 ? (
            <>
              <span className="font-medium radio-digit flex items-center">
                {tripIcon && <span className="mr-2">{tripIcon}</span>}
                DAY {currentDay + 1}
              </span>
              <span className="radio-date-separator mx-2 opacity-80">|</span>
              <span className="font-medium radio-digit uppercase">
                {dayLabel}
              </span>
            </>
          ) : (
            <span className="font-medium radio-digit uppercase">
              {dayLabel}
            </span>
          )}
        </animated.div>
      </div>
    );
  };

  return (
    <div className="w-full py-2 px-2 md:px-3 animate-fade-in select-none">
      <div className="flex justify-between items-center mb-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <h2 className="text-base font-semibold flex items-center gap-1 text-mood-color cursor-help">
                <Radio size={16} className="opacity-80" />
                <span>Trip Radio</span>
                <Info size={12} className="opacity-60" />
              </h2>
            </TooltipTrigger>
            <TooltipContent className="p-2 max-w-xs">
              <p>📻 Trip Radio: Navigate through your trip timeline. Use the knob or click a day to plan activities!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={handlePlayPause}
            disabled={duration <= 1}
            className={`p-1 rounded-full h-7 w-7 flex items-center justify-center transition-colors ${
              isPlaying ? 'text-mood-color' : 'text-neo-text'
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>

      <div className="relative h-10 flex items-center">
        {/* Add a tuning knob on the right */}
        <div className="flex-1 relative z-10">
          <div
            ref={trackRef}
            className="relative w-full h-6 cursor-pointer rounded-xl overflow-hidden"
            onClick={handleTrackClick}
            style={{
              background: 'rgba(var(--mood-color-rgb), 0.1)',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
            }}
          >
            <animated.div
              className="absolute top-0 left-0 h-full"
              style={{
                ...trackSpring,
                background: 'rgba(var(--mood-color-rgb), 0.3)',
              }}
            />

            <animated.div
              ref={dialRef}
              className={`absolute top-0 h-full w-3 -ml-1.5 z-20 flex flex-col items-center ${isGlowing ? 'glow' : ''}`}
              style={{
                ...needleSpring,
                cursor: duration > 1 ? 'grab' : 'default'
              }}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <div
                className="h-full w-1 bg-mood-color rounded-full"
                style={{
                  boxShadow: isGlowing ? '0 0 5px var(--mood-color)' : 'none'
                }}
              />
            </animated.div>
          </div>

          <div className="relative w-full flex justify-between px-0.5 text-[10px] mt-1 text-mood-color">
            {timelineDisplayMarkers.map((marker, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col items-center transition-all duration-200`}
                onClick={() => handleTimelineDotClick(marker.day)}
              >
                <div 
                  className={`h-3 w-3 rounded-full transition-all duration-200 cursor-pointer
                    ${currentDay === marker.day ? 'radio-timeline-dot-active' : ''}
                    ${activeTimelineDot === marker.day ? 'radio-timeline-dot-pulse' : ''}
                  `}
                  style={{
                    backgroundColor: currentDay === marker.day ? 'var(--mood-color)' : 'rgba(var(--mood-color-rgb), 0.4)',
                    boxShadow: currentDay === marker.day ? '0 0 5px var(--mood-color)' : 'none'
                  }}
                />
                <span 
                  className={`mt-1 cursor-pointer transition-all duration-200 hover:font-medium
                    ${currentDay === marker.day ? 'font-medium' : 'opacity-80 hover:opacity-100'}
                  `}
                >
                  {marker.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tuning knob with improved rotation */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <animated.div 
                ref={knobRef}
                className="ml-3 h-16 w-16 rounded-full bg-white shadow-neo-card flex items-center justify-center cursor-pointer relative"
                style={{
                  transform: knobSpring.rotation.to(r => `rotate(${r}deg)`),
                  boxShadow: isGlowing ? '0 0 8px var(--mood-color), inset 0 0 3px rgba(var(--mood-color-rgb), 0.5)' : 'inset 0 0 3px rgba(0, 0, 0, 0.1)',
                  border: '4px solid rgba(var(--mood-color-rgb), 0.1)'
                }}
                onMouseDown={handleKnobDragStart}
                onTouchStart={handleKnobDragStart}
              >
                <div 
                  className="h-2 w-2 rounded-full bg-mood-color absolute"
                  style={{
                    bottom: '8px',
                    boxShadow: isGlowing ? '0 0 5px var(--mood-color)' : 'none'
                  }}
                />
                {/* Add indicator marks around the knob */}
                {Array.from({ length: Math.min(duration, 8) }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-1.5 w-0.5 bg-mood-color opacity-50"
                    style={{
                      transform: `rotate(${i * (360 / Math.min(duration, 8))}deg) translateY(-6px)`,
                      top: '50%',
                      left: '50%',
                    }}
                  />
                ))}
              </animated.div>
            </TooltipTrigger>
            <TooltipContent className="p-2 max-w-xs">
              <p>Rotate to navigate through your trip days</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {renderDayDisplay()}
    </div>
  );
};

// Add styles for the radio interface
const RadioStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
      
      .radio-console {
        background: linear-gradient(145deg, rgba(var(--mood-color-rgb), 0.05), rgba(var(--mood-color-rgb), 0.12));
        border: 1px solid rgba(var(--mood-color-rgb), 0.2);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      }
      
      .radio-dial {
        transition: transform 0.1s ease, box-shadow 0.2s ease;
      }
      
      .radio-dial-active {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.8);
      }
      
      .radio-control-button {
        background: rgba(var(--mood-color-rgb), 0.2);
        box-shadow: 0 2px 4px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.3);
      }
      
      .radio-digit {
        font-family: 'VT323', monospace;
        letter-spacing: 1px;
        text-shadow: 0 0 5px rgba(var(--mood-color-rgb), 0.4);
      }
      
      .radio-date-separator {
        opacity: 0.7;
      }
      
      .radio-needle {
        box-shadow: 0 0 8px rgba(var(--mood-color-rgb), 0.7);
        transition: box-shadow 0.3s ease;
      }
      
      .radio-needle-glow {
        box-shadow: 0 0 15px rgba(var(--mood-color-rgb), 0.95);
      }
      
      .radio-track-glow {
        box-shadow: inset 0 0 12px rgba(var(--mood-color-rgb), 0.7);
      }
      
      .radio-display-glow {
        box-shadow: 0 0 12px rgba(var(--mood-color-rgb), 0.6);
      }
      
      .radio-frequency-band {
        background-image: repeating-linear-gradient(90deg, 
          rgba(var(--mood-color-rgb), 0.05), 
          rgba(var(--mood-color-rgb), 0.05) 10px, 
          rgba(var(--mood-color-rgb), 0.08) 10px, 
          rgba(var(--mood-color-rgb), 0.08) 20px
        );
      }
      
      /* New styles for interactive timeline dots */
      .radio-timeline-dot-active {
        transform: scale(1.2);
      }
      
      .radio-timeline-dot-pulse {
        animation: pulse 1.5s infinite;
      }
      
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.4);
          opacity: 0.7;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `}
  </style>
);


const TimeSliderWrapper = () => (
  <>
    <RadioStyles />
    <TimeSlider />
  </>
);

export default TimeSliderWrapper;
