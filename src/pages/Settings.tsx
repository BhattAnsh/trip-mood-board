import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import Header from '../components/Header';
import { 
  Hourglass, 
  Bike, 
  Coffee, 
  Code, 
  Cpu, 
  Hammer, 
  Laptop, 
  MonitorSmartphone, 
  Settings as SettingsIcon, 
  TimerReset,
  Undo2,
  CupSoda
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  
  // Trigger settings saved animation
  const handleSaveSettings = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      setSettingsSaved(true);
      setIsAnimating(false);
    }, 1000);
    
    setTimeout(() => {
      setSettingsSaved(false);
    }, 3000);
  };
  
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-neo-bg">
        {/* Using the shared Header component */}
        <Header />
        
        {/* Main Content */}
        <div className="max-w-6xl mx-auto pt-24 sm:pt-28 px-4 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-mood-color flex items-center gap-2">
              <SettingsIcon className="text-mood-color" />
              Settings
            </h1>
            <button 
              onClick={() => navigate(-1)}
              className="neo-button bg-mood-color text-white font-medium flex items-center justify-center gap-2 px-4 py-2"
            >
              <Undo2 size={18} />
              <span>Go Back</span>
            </button>
          </div>
          
          {/* Hackathon Message Card */}
          <div className="shadow-neo-card rounded-xl bg-neo-bg overflow-hidden p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8 relative">
              {/* Animation container */}
              <div className="w-full md:w-1/3 relative">
                <div className="aspect-square bg-mood-color-10 rounded-xl shadow-neo-flat flex items-center justify-center relative overflow-hidden">
                  {/* Clock animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-mood-color relative">
                      {/* Hour hand */}
                      <div className="absolute top-1/2 left-1/2 w-1.5 h-16 sm:h-20 bg-mood-color rounded-full origin-bottom transform -translate-x-1/2 -rotate-45 animate-spin" style={{ animationDuration: '60s' }}></div>
                      
                      {/* Minute hand */}
                      <div className="absolute top-1/2 left-1/2 w-1 h-20 sm:h-24 bg-mood-color-20 rounded-full origin-bottom transform -translate-x-1/2 rotate-45 animate-spin" style={{ animationDuration: '6s' }}></div>
                      
                      {/* Center dot */}
                      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-mood-color rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                  
                  {/* Spinning elements in corners */}
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-lg bg-mood-color-10 flex items-center justify-center shadow-neo-flat animate-float-slow">
                    <Coffee size={24} className="text-mood-color" />
                  </div>
                  
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-lg bg-mood-color-10 flex items-center justify-center shadow-neo-flat animate-pulse-slow">
                    <Code size={24} className="text-mood-color" />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-lg bg-mood-color-10 flex items-center justify-center shadow-neo-flat animate-float">
                    <Laptop size={24} className="text-mood-color" />
                  </div>
                  
                  <div className="absolute bottom-4 right-4 w-12 h-12 rounded-lg bg-mood-color-10 flex items-center justify-center shadow-neo-flat animate-bounce-slow">
                    <Hammer size={24} className="text-mood-color" />
                  </div>
                </div>
              </div>
              
              {/* Hackathon message */}
              <div className="w-full md:w-2/3">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-mood-color mb-4 flex items-center">
                  <Hourglass className="mr-2 animate-bounce-slow" size={28} />
                  Hackathon Time Crunch!
                </h2>
                
                <div className="p-4 rounded-lg shadow-neo-flat bg-mood-color-10/10 mb-4 transform transition-all duration-300 hover:shadow-neo-card-hover hover:-rotate-1">
                  <p className="text-lg md:text-xl font-medium mb-2 text-mood-color">
                    "Time khatam ho raha hai, lekin features abhi baaki hai!"
                  </p>
                  <p className="text-base text-neo-text">
                    Hackathon mein hum log coding-voding kar rahe hai, lekin settings page ke liye time hi nahi mila! Bas animations daal diye, taki cool lage. Baad mein kabhi proper settings add kar denge... pakka promise! 😉
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="neo-card p-3 rounded-lg flex items-center gap-2 animate-float" style={{ animationDelay: '0.1s' }}>
                    <CupSoda size={18} className="text-mood-color" />
                    <span className="text-sm font-medium">15 cups of chai!</span>
                  </div>
                  
                  <div className="neo-card p-3 rounded-lg flex items-center gap-2 animate-float" style={{ animationDelay: '0.2s' }}>
                    <Cpu size={18} className="text-mood-color" />
                    <span className="text-sm font-medium">2 all-nighters!</span>
                  </div>
                  
                  <div className="neo-card p-3 rounded-lg flex items-center gap-2 animate-float" style={{ animationDelay: '0.3s' }}>
                    <TimerReset size={18} className="text-mood-color" />
                    <span className="text-sm font-medium">Deadline approaching!</span>
                  </div>
                  
                  <div className="neo-card p-3 rounded-lg flex items-center gap-2 animate-float" style={{ animationDelay: '0.4s' }}>
                    <Bike size={18} className="text-mood-color" />
                    <span className="text-sm font-medium">Racing to finish!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dummy settings that do nothing */}
          <div className="shadow-neo-card rounded-xl bg-neo-bg overflow-hidden p-6 mb-8">
            <h3 className="text-xl font-semibold text-mood-color mb-4 flex items-center">
              <MonitorSmartphone className="mr-2" size={20} />
              App Settings
            </h3>
            
            <div className="space-y-4">
              {/* Theme toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg shadow-neo-flat">
                <div>
                  <h4 className="font-medium text-mood-color">Dark Mode</h4>
                  <p className="text-sm text-neo-text opacity-70">Enable dark mode for night time usage</p>
                </div>
                <div className="w-12 h-6 bg-mood-color-10 rounded-full p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-neo-bg rounded-full shadow-neo-flat"></div>
                </div>
              </div>
              
              {/* Notifications toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg shadow-neo-flat">
                <div>
                  <h4 className="font-medium text-mood-color">Push Notifications</h4>
                  <p className="text-sm text-neo-text opacity-70">Receive important updates</p>
                </div>
                <div className="w-12 h-6 bg-mood-color rounded-full p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-neo-bg rounded-full shadow-neo-flat ml-auto"></div>
                </div>
              </div>
              
              {/* Data saving toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg shadow-neo-flat">
                <div>
                  <h4 className="font-medium text-mood-color">Data Saving Mode</h4>
                  <p className="text-sm text-neo-text opacity-70">Reduce data usage when on mobile</p>
                </div>
                <div className="w-12 h-6 bg-mood-color-10 rounded-full p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-neo-bg rounded-full shadow-neo-flat"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSaveSettings}
                className={`neo-button bg-mood-color text-white font-medium flex items-center justify-center gap-2 px-6 py-2 ${isAnimating ? 'animate-pulse' : ''} transition-all`}
                disabled={isAnimating}
              >
                <SettingsIcon size={18} />
                <span>{isAnimating ? 'Saving...' : settingsSaved ? 'Saved!' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
          
          {/* Version info */}
          <div className="text-center text-sm text-neo-text opacity-70">
            <p>Trip Canvas Vibes - Hackathon Edition v0.1.0</p>
            <p className="mt-1">© {new Date().getFullYear()} The Coding Challengers</p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Settings;
