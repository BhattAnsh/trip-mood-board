import React, { useRef } from 'react';
import { useTheme } from '../hooks/use-theme';
import { Music, SkipForward, SkipBack, Play, Pause, Volume2, VolumeX } from 'lucide-react';

// This is a compact version of the Spotify player specifically for small mobile screens
const SpotifyPlayerMobile = ({ 
  currentTrack, 
  isPaused, 
  isActive, 
  progress, 
  duration,
  onTogglePlay,
  onSkipNext,
  onSkipPrevious,
  onToggleMute,
  isMuted,
  onProgressChange
}) => {
  const progressBarRef = useRef(null);
  
  const getProgressPercentage = () => {
    if (!duration) return 0;
    const percentage = (progress / duration) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100
  };

  const formatTime = (ms) => {
    if (!ms || ms < 0) return '0:00';
    
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle clicks on the progress bar to seek
  const handleProgressBarClick = (e) => {
    if (!progressBarRef.current || !duration || !onProgressChange) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newPosition = Math.max(0, Math.min(1, percentage)) * duration;
    
    onProgressChange(newPosition);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Album art and track info - simplified for smaller screens */}
      <div className="flex items-center mb-1.5">
        {/* Cover art - optimized for touch */}
        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 mr-2 shadow-neo-card">
          {currentTrack?.album?.images?.[0]?.url ? (
            <img
              src={currentTrack.album.images[0].url}
              alt={`Album cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neo-bg flex items-center justify-center">
              <Music size={12} className="text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Track info with artist */}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate text-mood-color text-xs">
            {currentTrack?.name || "No track playing"}
          </p>
          <p className="text-[9px] truncate opacity-70">
            {currentTrack?.artists?.map(a => a.name).join(", ") || ""}
          </p>
        </div>
      </div>
      
      {/* Progress bar - improved for touch */}
      <div className="mb-1.5 mt-auto">
        <div 
          ref={progressBarRef}
          className="h-2.5 w-full bg-neo-bg rounded-full overflow-hidden shadow-inner relative touch-manipulation"
          onClick={handleProgressBarClick}
          style={{ touchAction: 'none' }}
        >
          <div 
            className="h-full bg-mood-color rounded-full shadow-sm"
            style={{ 
              width: `${getProgressPercentage()}%`,
              transition: 'width 100ms linear'
            }}
          ></div>
          
          {/* Draggable knob for better touch interaction */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-mood-color shadow-md border-2 border-white"
            style={{
              left: `calc(${getProgressPercentage()}% - 8px)`,
              display: duration ? 'block' : 'none'
            }}
          ></div>
        </div>
        
        {/* Time indicators - better spacing */}
        <div className="flex justify-between text-[8px] opacity-60 mt-1">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Playback controls - larger touch targets */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={onSkipPrevious}
            className="p-1.5 text-mood-color hover:opacity-80 transition-opacity rounded-full shadow-neo-btn active:shadow-neo-btn-pressed"
            disabled={!isActive}
            aria-label="Previous track"
          >
            <SkipBack size={12} />
          </button>
          
          <button
            onClick={onTogglePlay}
            className="p-1 mx-1 w-7 h-7 rounded-full shadow-neo-btn active:shadow-neo-btn-pressed bg-neo-bg text-mood-color flex items-center justify-center"
            disabled={!isActive}
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
          </button>
          
          <button
            onClick={onSkipNext}
            className="p-1.5 text-mood-color hover:opacity-80 transition-opacity rounded-full shadow-neo-btn active:shadow-neo-btn-pressed"
            disabled={!isActive}
            aria-label="Next track"
          >
            <SkipForward size={12} />
          </button>
        </div>
        
        <button
          onClick={onToggleMute}
          className="p-1.5 text-mood-color hover:opacity-80 transition-opacity rounded-full shadow-neo-btn active:shadow-neo-btn-pressed"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </button>
      </div>
    </div>
  );
};

export default SpotifyPlayerMobile;
