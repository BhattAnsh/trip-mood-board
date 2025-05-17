# Trip Canvas Vibes

## Project Overview

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Getting Started

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Setting Up Spotify Integration

This project includes a Spotify player integration for adding soundtrack to your trip memories. To set it up:

1. Create a Spotify Developer account at [developer.spotify.com](https://developer.spotify.com/)
2. Create a new app in the Spotify Developer Dashboard
3. Add `http://localhost:5173/spotify-callback` to the Redirect URIs in your app settings
4. Create a `.env.local` file in the project root with the following variables:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/spotify-callback
   ```
5. Replace `your_client_id_here` and `your_client_secret_here` with your actual Spotify API credentials

Note: For production deployment, you'll need to update the redirect URI accordingly.
