import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { useTrip } from '../hooks/use-trip';
import { useTheme } from '../hooks/use-theme';
import { Music, SkipForward, SkipBack, Play, Pause, Volume2, VolumeX, ExternalLink, ChevronLeft } from 'lucide-react';
import SpotifyWebApi from 'spotify-web-api-js';
import { useNavigate } from 'react-router-dom';
// Import the Player type from our declaration file
import type { SpotifyPlayer } from '../types/spotify';
import SpotifyPlayerMobile from './SpotifyPlayerMobile';

// Define interfaces for Spotify auth and track data
interface SpotifyAuth {
  accessToken: string | null;
  expiresAt: number | null;
  refreshToken: string | null;
}

interface SpotifyTrackImage {
  url: string;
  height?: number;
  width?: number;
}

interface SpotifyTrackArtist {
  name: string;
  uri: string;
}

interface SpotifyTrackAlbum {
  name: string;
  uri: string;
  images: SpotifyTrackImage[];
}

interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  type: string;
  album: SpotifyTrackAlbum;
  artists: SpotifyTrackArtist[];
  duration_ms: number;
}

// Demo mode data
const DEMO_TRACKS = [
  {
    id: "demo1",
    name: "Summer Memories",
    uri: "spotify:track:demo1",
    type: "track",
    album: {
      name: "Trip Vibes",
      uri: "spotify:album:demo1",
      images: [{ url: "https://picsum.photos/seed/summer/300/300", height: 300, width: 300 }]
    },
    artists: [{ name: "Vacation DJ", uri: "spotify:artist:demo1" }],
    duration_ms: 217000
  },
  {
    id: "demo2",
    name: "Beach Sunset",
    uri: "spotify:track:demo2",
    type: "track",
    album: {
      name: "Coastal Sounds",
      uri: "spotify:album:demo2",
      images: [{ url: "https://picsum.photos/seed/beach/300/300", height: 300, width: 300 }]
    },
    artists: [{ name: "Ocean Waves", uri: "spotify:artist:demo2" }],
    duration_ms: 195000
  },
  {
    id: "demo3",
    name: "Road Trip Anthem",
    uri: "spotify:track:demo3",
    type: "track",
    album: {
      name: "Highway Collection",
      uri: "spotify:album:demo3",
      images: [{ url: "https://picsum.photos/seed/road/300/300", height: 300, width: 300 }]
    },
    artists: [{ name: "The Travelers", uri: "spotify:artist:demo3" }],
    duration_ms: 243000
  },
  {
    id: "demo4",
    name: "Mountain Heights",
    uri: "spotify:track:demo4",
    type: "track",
    album: {
      name: "Alpine Journeys",
      uri: "spotify:album:demo4",
      images: [{ url: "https://picsum.photos/seed/mountain/300/300", height: 300, width: 300 }]
    },
    artists: [{ name: "Peak Climbers", uri: "spotify:artist:demo4" }],
    duration_ms: 228000
  },
  {
    id: "demo5",
    name: "City Lights",
    uri: "spotify:track:demo5",
    type: "track",
    album: {
      name: "Urban Explorations",
      uri: "spotify:album:demo5",
      images: [{ url: "https://picsum.photos/seed/city/300/300", height: 300, width: 300 }]
    },
    artists: [{ name: "Metropolis Band", uri: "spotify:artist:demo5" }],
    duration_ms: 204000
  },
  {
    id: "demo6",
    name: "Desert Sands",
    uri: "spotify:track:demo6",
    type: "track",
    album: {
      name: "Oasis Dreams",
      uri: "spotify:album:demo6",
      images: [{ url: "https://picsum.photos/seed/desert/300/300", height: 300, width: 300 }]
    },
    artists: [{ name: "Dune Wanderers", uri: "spotify:artist:demo6" }],
    duration_ms: 256000
  },
  {
    id: "demo7",
    name: "Rainforest Echoes",
    uri: "spotify:track:demo7",
    type: "track",
    album: {
      name: "Tropical Journeys",
      uri: "spotify:album:demo7",
      images: [{ url: "https://picsum.photos/seed/jungle/300/300", height: 300, width: 300 }]
    },
    artists: [{ name: "Nature Sounds", uri: "spotify:artist:demo7" }],
    duration_ms: 231000
  }
];

const SpotifyPlayer: React.FC = () => {
  const { currentTrip } = useTrip();
  const navigate = useNavigate();
  const [spotifyAuth, setSpotifyAuth] = useState<SpotifyAuth>({
    accessToken: null,
    expiresAt: null,
    refreshToken: null
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoTrackIndex, setDemoTrackIndex] = useState(0);
  // Track progress states
  const [trackProgress, setTrackProgress] = useState(0);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Add useMemo to improve performance and fix dependency issues
  const spotifyApi = React.useMemo(() => new SpotifyWebApi(), []);

  // Debug log to check if the client ID is being loaded
  useEffect(() => {
    console.log('Spotify Client ID check:', 
      import.meta.env.VITE_SPOTIFY_CLIENT_ID ? 'Present' : 'Missing',
      'Length:', import.meta.env.VITE_SPOTIFY_CLIENT_ID?.length || 0,
      'Value:', import.meta.env.VITE_SPOTIFY_CLIENT_ID);
      
    // Force clear auth on first load - remove this after testing
    if (import.meta.env.VITE_SPOTIFY_CLIENT_ID && 
        import.meta.env.VITE_SPOTIFY_CLIENT_ID !== 'your_spotify_client_id_here') {
      console.log('Found valid client ID, clearing stored auth to force new login');
      localStorage.removeItem('spotifyAuth');
    }
  }, []);
  
  // Progress tracking effect - start the interval when playing, clear it when paused
  useEffect(() => {
    if (isDemoMode && !isPaused && currentTrack) {
      // Skip setTrackProgress(0) here to avoid causing re-renders
      
      // Clear any existing interval
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      // Create a new interval that updates progress every 100ms for smoother animation
      const interval = setInterval(() => {
        setTrackProgress(prev => {
          // Reset to 0 when reaching the end of the track
          if (prev >= currentTrack.duration_ms) {
            // Need to clear this interval before changing tracks to avoid race conditions
            clearInterval(interval);
            
            // Wait a moment before changing tracks for a smoother experience
            setTimeout(() => {
              const nextIndex = (demoTrackIndex + 1) % DEMO_TRACKS.length;
              setDemoTrackIndex(nextIndex);
              setCurrentTrack(DEMO_TRACKS[nextIndex]);
              // Don't reset track progress here, we'll handle it in the reset effect
            }, 250);
            
            return currentTrack.duration_ms; // Keep at 100% until track changes
          }
          return prev + 100; // Add 100ms for smoother updates
        });
      }, 100);
      
      setProgressInterval(interval);
      
      // Clean up interval on unmount
      return () => clearInterval(interval);
    } else if (progressInterval) {
      // Clear interval when paused
      clearInterval(progressInterval);
      setProgressInterval(null);
    }
  }, [isDemoMode, isPaused, currentTrack, demoTrackIndex]);
  
  // Reset progress when changing tracks
  useEffect(() => {
    if (currentTrack) {
      // Only reset track progress when the track changes
      // We use the currentTrack.id to detect track changes
      setTrackProgress(0);
    }
  }, [currentTrack?.id]);
  
  // Initialize Spotify Web Playback SDK or Demo Mode
  useEffect(() => {
    // Check if token exists in local storage
    const savedAuth = localStorage.getItem('spotifyAuth');
    
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth) as SpotifyAuth;
        if (parsedAuth.accessToken) {
          setSpotifyAuth(parsedAuth);
          
          // Check if we're in demo mode (mock token)
          if (parsedAuth.accessToken.startsWith('mock_')) {
            console.log('Demo mode activated with mock token');
            setIsDemoMode(true);
            setIsAuthenticated(true);
            setIsActive(true);
            setCurrentTrack(DEMO_TRACKS[0]);
            setIsPaused(false); // Ensure we're playing on reload
          } else if (parsedAuth.expiresAt && Date.now() < parsedAuth.expiresAt) {
            console.log('Using real Spotify token');
            spotifyApi.setAccessToken(parsedAuth.accessToken);
            setIsAuthenticated(true);
            initializePlayer(parsedAuth.accessToken);
            setIsDemoMode(false);
          } else if (parsedAuth.refreshToken) {
            // Refresh token logic
            console.log("Token expired, refreshing token");
            refreshAccessToken(parsedAuth.refreshToken);
          }
        }
      } catch (error) {
        console.error("Failed to parse stored auth:", error);
        // Fall back to demo mode in case of errors
        enableDemoMode();
      }
    } else {
      // Automatically activate demo mode if no auth is found
      console.log("No auth found, auto-activating demo mode");
      enableDemoMode();
    }
    
    setIsLoading(false);
    // We're intentionally not including dependencies here as this should only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add a refresh token function
  const refreshAccessToken = async (refreshToken: string) => {
    // In a real app, this would be a server-side call
    // For demo purposes, we'll simulate a successful refresh
    console.log("Refreshing token with:", refreshToken);
    
    try {
      // For a real implementation, you would call your backend API
      // const response = await fetch('/api/refresh-token', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ refreshToken })
      // });
      // const data = await response.json();
      
      // For demo purposes, simulate a successful token refresh
      const mockTokenResponse = {
        access_token: 'mock_access_token_' + Date.now(),
        expires_in: 3600 // 1 hour
      };
      
      const expiresAt = Date.now() + (mockTokenResponse.expires_in * 1000);
      
      // Update stored auth with new token and expiry
      const updatedAuth = {
        accessToken: mockTokenResponse.access_token,
        refreshToken: refreshToken,
        expiresAt
      };
      
      localStorage.setItem('spotifyAuth', JSON.stringify(updatedAuth));
      setSpotifyAuth(updatedAuth);
      
      // Set demo mode since we're using mock tokens
      setIsDemoMode(true);
      setIsAuthenticated(true);
      setIsActive(true);
      setCurrentTrack(DEMO_TRACKS[0]);
      setIsPaused(false); // Start playing immediately
      
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // Clear invalid auth data
      localStorage.removeItem('spotifyAuth');
      setIsAuthenticated(false);
    }
  };
  
  // Helper function to create and configure the Spotify player
  const createAndConfigurePlayer = (token: string) => {
    // Skip player creation if in demo mode
    if (isDemoMode) return null;
    
    const player = new window.Spotify.Player({
      name: 'Trip Canvas Radio',
      getOAuthToken: cb => { cb(token); },
      volume: 0.5
    });
    
    player.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('Ready with Device ID', device_id);
      setDeviceId(device_id);
      
      // Transfer playback to this device
      spotifyApi.transferMyPlayback([device_id])
        .then(() => {
          console.log('Transferred playback to Trip Canvas Radio');
        })
        .catch(err => console.error("Transfer playback error:", err));
    });
    
    player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
      console.log('Device ID has gone offline', device_id);
    });
    
    player.addListener('player_state_changed', (state: unknown) => {
      if (state && typeof state === 'object' && state !== null) {
        // Type assertion after validation
        const playerState = state as { track_window: { current_track: SpotifyTrack }, paused: boolean };
        setCurrentTrack(playerState.track_window.current_track);
        setIsPaused(playerState.paused);
        setIsActive(true);
      }
    });
    
    player.connect();
    setPlayer(player as SpotifyPlayer);
    return player;
  };
  
  const initializePlayer = useCallback((token: string) => {
    // Skip actual Spotify SDK initialization if in demo mode
    if (isDemoMode) return;
    
    if (!window.Spotify) {
      // Load Spotify Player script if not already loaded
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
      
      window.onSpotifyWebPlaybackSDKReady = () => {
        createAndConfigurePlayer(token);
      };
    } else {
      createAndConfigurePlayer(token);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode]);
  
  const handleLogin = () => {
    // For demonstration purposes with two options:
    // 1. Demo mode without actual Spotify auth
    // 2. Real Spotify auth (if VITE_SPOTIFY_CLIENT_ID is configured)
    
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    
    console.log('Login attempt with client ID:', clientId ? 'Present' : 'Missing');
    
    // If no client ID is configured or client ID is placeholder, use demo mode
    if (!clientId || clientId === 'your_spotify_client_id_here') {
      console.log("No valid Spotify client ID found, using demo mode");
      // Create mock auth data
      const mockTokenResponse = {
        access_token: 'mock_access_token_' + Date.now(),
        refresh_token: 'mock_refresh_token',
        expires_in: 3600 // 1 hour
      };
      
      const expiresAt = Date.now() + (mockTokenResponse.expires_in * 1000);
      localStorage.setItem('spotifyAuth', JSON.stringify({
        accessToken: mockTokenResponse.access_token,
        refreshToken: mockTokenResponse.refresh_token,
        expiresAt
      }));
      
      setIsDemoMode(true);
      setIsAuthenticated(true);
      setIsActive(true);
      setCurrentTrack(DEMO_TRACKS[0]);
      setIsPaused(false); // Start playing immediately
      
      return;
    }
    
    // Clear any existing auth first
    localStorage.removeItem('spotifyAuth');
    
    // Real Spotify authorization flow
    console.log('Starting real Spotify auth flow with client ID');
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 
                       `${window.location.origin}/spotify-callback`;
    const scopes = [
      'streaming', 
      'user-read-email', 
      'user-read-private', 
      'user-modify-playback-state', 
      'user-read-playback-state',
      'user-read-currently-playing'
    ];
    
    // Generate a random state value for security
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('spotify_auth_state', state);
    
    // Build authorization URL
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', scopes.join(' '));
    
    // Redirect to Spotify authorization page
    window.location.href = authUrl.toString();
  };
  
  // Playback control functions
  const togglePlay = () => {
    if (isDemoMode) {
      setIsPaused(!isPaused);
      return;
    }
    
    if (!player) return;
    player.togglePlay().catch(err => console.error("Toggle play error:", err));
  };
  
  const skipNext = () => {
    if (isDemoMode) {
      // Clear any existing interval first
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }
      
      // Change track
      const nextIndex = (demoTrackIndex + 1) % DEMO_TRACKS.length;
      setDemoTrackIndex(nextIndex);
      setCurrentTrack(DEMO_TRACKS[nextIndex]);
      
      // Reset progress
      setTrackProgress(0);
      return;
    }
    
    if (!player) return;
    player.nextTrack().catch(err => console.error("Skip next error:", err));
  };
  
  const skipPrevious = () => {
    if (isDemoMode) {
      // Clear any existing interval first
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }
      
      // Change track
      const prevIndex = (demoTrackIndex - 1 + DEMO_TRACKS.length) % DEMO_TRACKS.length;
      setDemoTrackIndex(prevIndex);
      setCurrentTrack(DEMO_TRACKS[prevIndex]);
      
      // Reset progress
      setTrackProgress(0);
      return;
    }
    
    if (!player) return;
    player.previousTrack().catch(err => console.error("Skip previous error:", err));
  };
  
  const toggleMute = () => {
    if (isDemoMode) {
      setIsMuted(!isMuted);
      return;
    }
    
    if (!player) return;
    
    if (isMuted) {
      player.setVolume(volume / 100).catch(err => console.error("Set volume error:", err));
    } else {
      player.setVolume(0).catch(err => console.error("Mute error:", err));
    }
    
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    
    if (isDemoMode) {
      setIsMuted(newVolume === 0);
      return;
    }
    
    if (player) {
      player.setVolume(newVolume / 100).catch(err => console.error("Set volume error:", err));
      setIsMuted(newVolume === 0);
    }
  };
  
  // Handle clicking on the progress bar to jump to a position
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentTrack || !isDemoMode) return;
    
    // Get the progress bar element
    const progressBar = e.currentTarget;
    // Calculate the click position relative to the progress bar width
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    // Calculate the percentage of the click position
    const percentage = clickPosition / progressBarWidth;
    // Calculate the new track position in milliseconds
    const newPosition = currentTrack.duration_ms * percentage;
    
    // Update the track progress
    setTrackProgress(newPosition);
  };
  
  // Helper function to format milliseconds to mm:ss
  const formatTime = (ms: number) => {
    if (!ms || ms < 0) return '0:00';
    
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Get current progress percentage safely
  const getProgressPercentage = () => {
    if (!currentTrack || !currentTrack.duration_ms) return 0;
    const percentage = (trackProgress / currentTrack.duration_ms) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100
  };

  // Helper function to enable demo mode
  const enableDemoMode = () => {
    // Create mock auth data
    const mockTokenResponse = {
      access_token: 'mock_access_token_' + Date.now(),
      refresh_token: 'mock_refresh_token',
      expires_in: 3600 // 1 hour
    };
    
    const expiresAt = Date.now() + (mockTokenResponse.expires_in * 1000);
    localStorage.setItem('spotifyAuth', JSON.stringify({
      accessToken: mockTokenResponse.access_token,
      refreshToken: mockTokenResponse.refresh_token,
      expiresAt
    }));
    
    // Clear any existing interval
    if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
    }
    
    setTrackProgress(0);
    setDemoTrackIndex(0);
    setIsDemoMode(true);
    setIsAuthenticated(true);
    setIsActive(true);
    setCurrentTrack(DEMO_TRACKS[0]);
    setIsPaused(false); // Start playing immediately
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-mood-color"></div>
      </div>
    );
  }
  
  // Render login button if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="w-full h-full p-2 sm:p-3 relative">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold flex items-center gap-1.5 text-mood-color">
            <Music size={16} className="opacity-80" />
            <span>Trip Soundtrack</span>
          </h2>
          
          <button
            onClick={handleLogin}
            className="py-1.5 px-4 text-sm rounded-full bg-mood-color text-white hover:opacity-90 transition-opacity shadow-neo-btn"
          >
            Connect Spotify
          </button>
        </div>

        <div className="flex items-center mt-2">
          {/* Album art or placeholder */}
          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 mr-3 shadow-neo-card">
            <div className="w-full h-full bg-neo-bg flex items-center justify-center">
              <Music size={24} className="text-gray-400" />
            </div>
          </div>

          {/* Track info and controls */}
          <div className="flex-1 min-w-0">
            <div className="h-full flex flex-col justify-center">
              <p className="text-mood-color font-medium mb-1">Connect your Spotify account</p>
              <p className="text-xs opacity-80">Add a soundtrack to your travel memories</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full p-2 sm:p-3 relative flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm sm:text-base font-semibold flex items-center gap-1.5 text-mood-color">
          <Music size={16} className="opacity-80" />
          <span className="sm:inline xs:hidden">Trip Soundtrack</span>
          <span className="xs:inline sm:hidden">Soundtrack</span>
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/app/trips')}
            className="p-1 text-mood-color hover:opacity-80 transition-opacity rounded-full shadow-neo-btn hover:shadow-neo-btn-hover active:shadow-neo-btn-pressed"
            aria-label="Back to trips"
            title="Back to trips"
          >
            <ChevronLeft size={15} className="sm:w-4 sm:h-4" />
          </button>
          
          <div className="text-[10px] flex items-center gap-1 bg-neo-bg shadow-neo-inset px-1.5 py-0.5 rounded-full">
            {isDemoMode && (
              <>
                <span className="animate-pulse bg-mood-color h-1.5 w-1.5 rounded-full opacity-80"></span>
                <span className="text-mood-color opacity-80">Demo</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Responsive layout - show different UI based on screen size */}
      <div className="hidden xs:flex sm:hidden items-center justify-center flex-1 min-h-0">
        {/* Mobile/XS layout - use the mobile player component */}
        <div className="w-full h-full overflow-hidden flex items-center">
          <SpotifyPlayerMobile
            currentTrack={currentTrack}
            isPaused={isPaused}
            isActive={isActive}
            progress={trackProgress}
            duration={currentTrack?.duration_ms}
            onTogglePlay={togglePlay}
            onSkipNext={skipNext}
            onSkipPrevious={skipPrevious}
            onToggleMute={toggleMute}
            isMuted={isMuted}
            onProgressChange={setTrackProgress}
          />
        </div>
      </div>

      {/* Standard layout for larger screens */}
      <div className="xs:hidden flex items-center flex-1 min-h-0">
        {/* Album art or placeholder with neomorphic styling */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 mr-2 sm:mr-3 shadow-neo-card">
          {currentTrack?.album?.images?.[0]?.url ? (
            <img
              src={currentTrack.album.images[0].url}
              alt={`${currentTrack.album.name} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neo-bg flex items-center justify-center">
              <Music size={20} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Track info and controls */}
        <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
          <div className="mb-2 overflow-hidden">
            <p className="font-medium truncate text-mood-color text-sm">
              {currentTrack?.name || "No track playing"}
            </p>
            <p className="text-xs truncate opacity-80">
              {currentTrack?.artists?.map(a => a.name).join(", ") || "Connect to start listening"}
            </p>
          </div>
          
          {/* Track progress bar */}
          <div className="mb-2 relative">
            {/* Neomorphic container for the progress bar */}
            <div 
              className="h-1.5 sm:h-2 w-full bg-neo-bg rounded-full overflow-hidden shadow-inner cursor-pointer relative group"
              onClick={handleProgressBarClick}
            >
              {/* Progress fill */}
              <div 
                className="h-full bg-mood-color rounded-full shadow-sm"
                style={{ 
                  width: `${getProgressPercentage()}%`,
                  transition: 'width 100ms linear'
                }}
              ></div>
              
              {/* Hover dot for better visual feedback */}
              <div 
                className="w-2.5 h-2.5 rounded-full bg-mood-color absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow-neo-card"
                style={{ 
                  left: `calc(${getProgressPercentage()}% - 6px)`,
                  display: getProgressPercentage() > 0 ? 'block' : 'none'
                }}
              ></div>
            </div>
            
            {/* Time indicators */}
            <div className="flex justify-between text-[9px] sm:text-xs opacity-60 mt-1">
              <span>{formatTime(trackProgress)}</span>
              <span>{currentTrack ? formatTime(currentTrack.duration_ms) : '0:00'}</span>
            </div>
          </div>

          {/* Player controls with neomorphic styling - auto-adjusting size */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center">
              <button
                onClick={skipPrevious}
                className="p-1 text-mood-color hover:opacity-80 transition-opacity rounded-full shadow-neo-btn hover:shadow-neo-btn-hover active:shadow-neo-btn-pressed"
                disabled={!isActive}
                aria-label="Previous track"
              >
                <SkipBack size={13} className="sm:w-4 sm:h-4" />
              </button>
              
              <button
                onClick={togglePlay}
                className="p-1.5 mx-2 sm:mx-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full shadow-neo-btn hover:shadow-neo-btn-hover active:shadow-neo-btn-pressed bg-neo-bg text-mood-color flex items-center justify-center"
                disabled={!isActive}
                aria-label={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play size={14} className="sm:w-5 sm:h-5" /> : <Pause size={14} className="sm:w-5 sm:h-5" />}
              </button>
              
              <button
                onClick={skipNext}
                className="p-1 text-mood-color hover:opacity-80 transition-opacity rounded-full shadow-neo-btn hover:shadow-neo-btn-hover active:shadow-neo-btn-pressed"
                disabled={!isActive}
                aria-label="Next track"
              >
                <SkipForward size={13} className="sm:w-4 sm:h-4" />
              </button>
            </div>
            
            <button
              onClick={toggleMute}
              className="p-1 text-mood-color hover:opacity-80 transition-opacity rounded-full shadow-neo-btn hover:shadow-neo-btn-hover active:shadow-neo-btn-pressed"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={13} className="sm:w-4 sm:h-4" /> : <Volume2 size={13} className="sm:w-4 sm:h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyPlayer;