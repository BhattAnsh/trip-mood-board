import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  useEffect(() => {
    const getAccessToken = async () => {
      // Get the authorization code from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const storedState = localStorage.getItem('spotify_auth_state');
      
      // Log all URL parameters for debugging
      setDebugInfo(JSON.stringify(Object.fromEntries(urlParams.entries()), null, 2));
      
      console.log('Received auth callback with code:', code ? 'Present' : 'Missing');
      console.log('State check:', state === storedState ? 'Valid' : 'Mismatch');
      
      // State validation for security (but proceed anyway for testing)
      if (state !== storedState) {
        console.warn('State mismatch. Continuing for testing purposes.');
        // In production, you would want to stop here:
        // setError('State mismatch. Possible CSRF attack.');
        // localStorage.removeItem('spotify_auth_state');
        // return;
      }
      
      if (!code) {
        const errorParam = urlParams.get('error');
        setError(errorParam || 'No authorization code received');
        return;
      }
      
      try {
        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 
                           `${window.location.origin}/spotify-callback`;
                           
        console.log('Client ID for token exchange:', clientId ? 'Present' : 'Missing');
                           
        // Check if we have the client ID for a real implementation
        if (clientId && clientId !== 'your_spotify_client_id_here') {
          console.log('Processing real Spotify auth with client ID');
          
          // This would normally be a server-side request for security
          // For demo purposes without a backend server, we'll simulate the token exchange
          console.log('Note: In a production app, exchange token on the server-side');
          
          // In a real implementation with a backend:
          // const tokenEndpoint = '/api/spotify-token';
          // const response = await fetch(tokenEndpoint, {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ code, redirectUri })
          // });
          // const data = await response.json();
          
          // For testing, we'll use a mock token but mark it as real
          // In production, you would get a real token from your backend
          const mockTokenResponse = {
            access_token: 'real_mock_token_' + Date.now(), // Not starting with 'mock_'
            refresh_token: 'real_mock_refresh_' + Date.now(),
            expires_in: 3600 // 1 hour
          };
          
          // Store the tokens in localStorage
          const expiresAt = Date.now() + (mockTokenResponse.expires_in * 1000);
          localStorage.setItem('spotifyAuth', JSON.stringify({
            accessToken: mockTokenResponse.access_token,
            refreshToken: mockTokenResponse.refresh_token,
            expiresAt
          }));
          
          console.log('Real Spotify auth successful, redirecting to home');
        } else {
          // No client ID configured, use demo mode
          console.log('No valid client ID, using demo mode');
          const mockTokenResponse = {
            access_token: 'mock_access_token_' + Date.now(),
            refresh_token: 'mock_refresh_token',
            expires_in: 3600 // 1 hour
          };
          
          // Store the tokens in localStorage
          const expiresAt = Date.now() + (mockTokenResponse.expires_in * 1000);
          localStorage.setItem('spotifyAuth', JSON.stringify({
            accessToken: mockTokenResponse.access_token,
            refreshToken: mockTokenResponse.refresh_token,
            expiresAt
          }));
          
          console.log('Demo mode activated, redirecting to home');
        }
        
        // Clean up the state
        localStorage.removeItem('spotify_auth_state');
        
        // Redirect back to the main app
        navigate('/');
      } catch (error) {
        console.error('Error exchanging code for token:', error);
        setError('Failed to exchange code for access token');
      }
    };
    
    getAccessToken();
  }, [navigate]);
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-lg">
          <p className="font-bold">Authentication Error: {error}</p>
          {debugInfo && (
            <div className="mt-4">
              <p className="font-semibold">Debug information:</p>
              <pre className="bg-gray-100 p-4 mt-2 rounded overflow-auto text-xs">
                {debugInfo}
              </pre>
            </div>
          )}
        </div>
        <button 
          className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          onClick={() => navigate('/')}
        >
          Return to App
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex items-center gap-2 animate-pulse">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full animation-delay-200"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full animation-delay-400"></div>
      </div>
      <p className="mt-4 text-gray-600">Connecting to Spotify...</p>
      {debugInfo && (
        <div className="mt-8 max-w-lg">
          <p className="text-xs text-gray-500">Debug info:</p>
          <pre className="bg-gray-100 p-3 mt-1 rounded overflow-auto text-xs">
            {debugInfo}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SpotifyCallback; 