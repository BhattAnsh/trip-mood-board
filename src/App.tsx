import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import SpotifyCallback from "./components/SpotifyCallback";
import Trips from "./pages/Trips";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TripProvider } from "./contexts/TripProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider>
          <TripProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              {/* Main App Routes */}
              <Route path="/app" element={<Index />} />
              <Route path="/app/trips" element={<Trips />} />
              {/* For backward compatibility, redirect /trips to /app/trips */}
              <Route path="/trips" element={<Navigate to="/app/trips" replace />} />
              <Route path="/spotify-callback" element={<SpotifyCallback />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TripProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
