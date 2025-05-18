# Trip Canvas Vibes: Neomorphic Travel Journal App

## 🏆 Hackathon Submission

This project was created for the Code Circuit by team Ansh Bhatt.

## 📱 Demo & Links

- [Live Demo](#) - https://mood-board-henna.vercel.app

## 🌟 Project Overview

Trip Canvas Vibes is a neomorphic-styled travel journal application that allows travelers to capture, organize, and relive their journey memories in a visually stunning interface. With a unique soft UI design approach that combines shadows and highlights to create a tactile experience, the app stands out from typical flat or material design apps.

### ✨ Key Features

- **Trip Planning & Organization**: Create and manage trips with custom themes, dates, and locations
- **Memory Canvas**: Interactive canvas to add photos, notes, and location pins for each trip day
- **Mood-based Theming**: Choose color themes that match the vibe of your trip
- **Neomorphic UI**: Enjoy a tactile, elevated user interface with soft shadows and highlights
- **Spotify Integration**: Add soundtracks to your trip memories for a multi-sensory experience
- **Responsive Design**: Fully functional on both desktop and mobile devices

## 🎨 Design Philosophy

Trip Canvas Vibes embraces neomorphism - a design trend that creates UI elements that appear to extrude from or be pressed into the background. This creates a soft, tactile interface that feels physical despite being digital. The design philosophy focuses on:

1. **Soft Shadows & Highlights**: Instead of hard shadows, we use subtle shadow combinations
2. **Monochromatic Color Schemes**: Each mood theme maintains a coherent color palette
3. **Subtle Animations**: Micro-interactions that enhance the physical feel of the interface
4. **Seamless Experience**: UI components that feel like they're part of a unified surface

## 💻 Tech Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Animations**: Framer Motion + CSS animations
- **Date Handling**: date-fns
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Music Integration**: Spotify Web API
- **Image Processing**: html-to-image

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/trip-canvas-vibes-neomorph.git

# Navigate to the project directory
cd trip-canvas-vibes-neomorph

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:5173` to see the app in action.

## 🎵 Setting Up Spotify Integration (Optional)

1. Create a Spotify Developer account at [developer.spotify.com](https://developer.spotify.com/)
2. Create a new app in the Spotify Developer Dashboard
3. Add `http://localhost:5173/spotify-callback` to the Redirect URIs in your app settings
4. Create a `.env.local` file in the project root with the following variables:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/spotify-callback
   ```

## 🧠 Technical Challenges & Solutions

1. **Neomorphic Design Implementation**: We created custom Tailwind CSS utilities to handle the complex shadow combinations needed for the neomorphic UI elements.

2. **Canvas Interaction**: Implemented drag-and-drop functionality for photos and notes using React Draggable, with state persistence.

3. **Responsive Design**: Optimized the neomorphic design to work across various screen sizes while maintaining its tactile feel.

4. **Performance Optimization**: Implemented lazy loading and code splitting to ensure smooth performance despite heavy use of shadows and animations.

## 🎯 Future Improvements

- Offline functionality using IndexedDB
- Cloud sync capabilities
- Social sharing features
- More interactive memory elements (audio recordings, weather data)
- AI-powered trip recommendations
- Advanced photo editing tools

## 👥 Team Members

- [Developer 1] - Frontend & UI Design
- [Developer 2] - Backend & Integration
- [Developer 3] - UX Design & Animation


## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ for CodeCircuit
