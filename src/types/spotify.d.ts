interface SpotifyPlayerConfig {
  name: string;
  getOAuthToken: (callback: (token: string) => void) => void;
  volume: number;
}

export interface SpotifyPlayer {
  _options: SpotifyPlayerConfig;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
  togglePlay: () => Promise<void>;
  setVolume: (volume_percent: number) => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  getCurrentState: () => Promise<unknown>;
  seek: (position_ms: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
}

export interface SpotifySDK {
  Player: new (config: SpotifyPlayerConfig) => SpotifyPlayer;
}

// Global augmentation
declare global {
  interface Window {
    Spotify: SpotifySDK;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

export {}; 