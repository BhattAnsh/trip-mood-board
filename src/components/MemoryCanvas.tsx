import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTrip } from '../hooks/use-trip';
import { Sticker } from '../types';
import { useTheme } from '../hooks/use-theme';
import { Trash2, Move, Maximize, ImageIcon, ZoomIn, ZoomOut, RefreshCw, MapPin, Map as MapIcon, Edit, Check, X, Download, Loader, TabletSmartphone, Calendar } from 'lucide-react';
import { annotate, annotationGroup } from 'rough-notation';
import { toPng } from 'html-to-image';
import { useIsMobile } from '../hooks/use-mobile';
import { format } from 'date-fns';

// Mobile notice component for small screens
const MobileNotice = ({ colorHex }: { colorHex: string }) => {
  const { currentTrip } = useTrip();
  
  if (!currentTrip) return null;
  
  return (
    <div className="absolute inset-0 z-50 p-4 flex flex-col items-center justify-center bg-neo-bg bg-opacity-95 overflow-y-auto">
      <div className="shadow-neo-card rounded-xl p-6 bg-white w-full max-w-xs mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold" style={{ color: colorHex }}>
            Trip Summary
          </h3>
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorHex }} />
        </div>
        
        {/* Trip details */}
        <div className="space-y-3 mb-4">
          <div className="rounded-lg p-3" style={{ backgroundColor: `${colorHex}10` }}>
            <h4 className="font-medium mb-1" style={{ color: colorHex }}>
              {currentTrip.title || "My Trip"}
            </h4>
            {currentTrip.startDate && (
              <div className="flex items-center text-sm text-neo-text">
                <Calendar size={14} className="mr-1" style={{ color: colorHex }} />
                {format(new Date(currentTrip.startDate), 'MMM d')} 
                {currentTrip.endDate && (
                  <>
                    {" "}- {format(new Date(currentTrip.endDate), 'MMM d, yyyy')}
                  </>
                )}
              </div>
            )}
            {currentTrip.location && (
              <div className="flex items-center text-sm text-neo-text">
                <MapPin size={14} className="mr-1" style={{ color: colorHex }} />
                {currentTrip.location}
              </div>
            )}
          </div>
        </div>
        
        {/* Sticker collage preview */}
        <div className="mb-4">
          <h4 className="text-sm mb-2" style={{ color: colorHex }}>Trip Memories</h4>
          <div className="relative rounded-lg overflow-hidden h-36 border border-neo-border">
            <div className="absolute inset-0 bg-gradient-to-b from-[#e6e9ef] to-[#d4dae6] flex items-center justify-center">
              {currentTrip.stickers.length > 0 ? (
                <div className="absolute inset-0">
                  {/* Display up to 3 emoji stickers from the trip */}
                  {currentTrip.stickers
                    .filter(s => s.type === 'emoji')
                    .slice(0, 3)
                    .map((sticker, index) => (
                      <div 
                        key={sticker.id}
                        className="absolute shadow-neo-flat px-2 py-1 rounded-lg bg-white hover:scale-110 transition-transform"
                        style={{
                          top: `${15 + (index * 25)}%`,
                          left: `${10 + (index * 15)}%`,
                          transform: `rotate(${-5 + (index * 5)}deg)`
                        }}
                      >
                        <span className="text-lg">{sticker.content}</span>
                      </div>
                    ))
                  }
                  
                  {/* Display up to 2 label stickers */}
                  {currentTrip.stickers
                    .filter(s => s.type === 'label')
                    .slice(0, 2)
                    .map((sticker, index) => (
                      <div 
                        key={sticker.id}
                        className="absolute shadow-neo-flat px-2 py-1 rounded-lg bg-white hover:scale-110 transition-transform"
                        style={{
                          top: `${20 + (index * 30)}%`,
                          right: `${15 + (index * 12)}%`,
                          transform: `rotate(${3 - (index * 6)}deg)`,
                          maxWidth: '40%'
                        }}
                      >
                        <p className="text-xs line-clamp-1" style={{ color: colorHex }}>
                          {sticker.content}
                        </p>
                      </div>
                    ))
                  }
                  
                  {/* Display a date indicator */}
                  <div className="absolute bottom-3 left-1/4 shadow-neo-flat px-2 py-1 rounded-lg bg-white hover:scale-110 transition-transform">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" style={{ color: colorHex }} />
                      <span className="text-xs">
                        {currentTrip.startDate ? format(new Date(currentTrip.startDate), 'MMM d') : 'Trip date'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm opacity-50">
                  <ImageIcon size={24} className="mx-auto mb-2" />
                  No memories added yet
                </div>
              )}
            </div>
            
            {/* Map preview with pin */}
            {currentTrip.location && (
              <div className="absolute top-2 right-2 bottom-2 left-1/2 rounded-lg border border-neo-border overflow-hidden">
                <div className="absolute inset-0 bg-[#e9edf3]">
                  {/* Map dots background */}
                  <div className="absolute inset-0 pattern-dots text-blue-500 opacity-20"></div>
                  
                  {/* Map grid lines */}
                  <div className="absolute inset-0 pattern-grid text-slate-500 opacity-10"></div>
                  
                  {/* Location pin */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center animate-bounce-slow shadow-md"
                      style={{ backgroundColor: colorHex }}
                    >
                      <MapPin size={12} className="text-white" />
                    </div>
                  </div>
                  
                  {/* Location name */}
                  <div className="absolute bottom-1 right-1 bg-white rounded px-1.5 py-0.5 text-[10px] font-medium shadow-sm">
                    {currentTrip.location.split(',')[0]}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* CTA button */}
        <div className="text-center">
          <p className="text-sm text-neo-text mb-3">
            For the full experience, please access this trip board on a tablet or desktop device.
          </p>
          <button 
            className="neo-button-raised px-4 py-2 w-full rounded-full font-medium"
            style={{ backgroundColor: `${colorHex}20`, color: colorHex }}
          >
            View Full Board on Desktop
          </button>
        </div>
      </div>
    </div>
  );
};

const MemoryCanvas = () => {
  const { 
    currentTrip, 
    currentDay, 
    updateStickerPosition, 
    updateStickerSize, 
    deleteSticker,
    addSticker,
    updateStickerContent
  } = useTrip();
  
  const { getMoodColorHex } = useTheme();
  const [activeStickerID, setActiveStickerID] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Add zoom and pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  // Stores if map outline has been added to the canvas
  const [hasMap, setHasMap] = useState(false);

  // Add state for text elements that need animation
  const textRefs = useRef(new Map<string, HTMLParagraphElement>());
  const [hasAppliedNotation, setHasAppliedNotation] = useState(false);
  
  // New state for popup editing
  const [editingStickerID, setEditingStickerID] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Add loading state for export
  const [isExporting, setIsExporting] = useState(false);

  // Safari detection helper
  const isSafari = () => {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('safari') > -1 && ua.indexOf('chrome') === -1;
  };
  
  // Multiple attempt toPng for Safari image loading issues
  const generatePngWithRetry = async (element: HTMLElement, options: {
    backgroundColor?: string;
    width?: number;
    height?: number;
    pixelRatio?: number;
    quality?: number;
    cacheBust?: boolean;
    [key: string]: unknown;
  } = {}, maxAttempts = 3) => {
    let dataUrl = '';
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // For attempts after the first one, add a delay
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // Generate the image
        dataUrl = await toPng(element, options);
        
        // If we have a reasonably sized image, assume it worked correctly
        if (dataUrl.length > 100000) {
          break;
        }
      } catch (err) {
        console.error(`Attempt ${attempt + 1} failed:`, err);
      }
    }
    
    return dataUrl;
  };

  useEffect(() => {
    // Filter stickers for the current day
    if (currentTrip) {
      const filtered = currentTrip.stickers.filter(
        (sticker) => sticker.day === currentDay
      );
      setStickers(filtered);
      
      // Check if map outline exists among stickers
      setHasMap(filtered.some(sticker => 
        sticker.type === 'label' && sticker.content === 'MAP_OUTLINE'
      ));
    }
  }, [currentTrip, currentDay]);

  useEffect(() => {
    // Update canvas size on mount and resize
    const updateSize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Small delay to ensure accurate size after DOM updates
    const resizeTimeout = setTimeout(updateSize, 100);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(resizeTimeout);
    };
  }, [currentDay]); // Re-measure when changing days

  // Add keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only respond to keyboard shortcuts when the canvas has focus
      if (!canvasRef.current?.contains(document.activeElement) && 
          document.activeElement !== canvasRef.current) {
        return;
      }

      switch (e.key) {
        case '+':
        case '=':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setScale(prev => Math.min(prev + 0.1, 3));
          }
          break;
        case '-':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setScale(prev => Math.max(prev - 0.1, 0.5));
          }
          break;
        case '0':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setScale(1);
            setPosition({ x: 0, y: 0 });
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setPosition(prev => ({ ...prev, x: prev.x + 10 }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setPosition(prev => ({ ...prev, x: prev.x - 10 }));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setPosition(prev => ({ ...prev, y: prev.y + 10 }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setPosition(prev => ({ ...prev, y: prev.y - 10 }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Add mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    // Determine zoom direction based on wheel delta
    if (e.ctrlKey || e.metaKey) {
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newScale = Math.max(0.5, Math.min(scale + delta, 3));
      
      // Get mouse position relative to canvas
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const mouseX = (e.clientX - canvasRect.left) / scale;
      const mouseY = (e.clientY - canvasRect.top) / scale;

      // Calculate new position to zoom toward mouse cursor
      const newPosition = {
        x: position.x - (mouseX * (newScale - scale)),
        y: position.y - (mouseY * (newScale - scale))
      };

      setScale(newScale);
      setPosition(newPosition);
    } else {
      // Pan with wheel if Ctrl/Cmd not pressed
      setPosition({
        x: position.x - e.deltaX,
        y: position.y - e.deltaY
      });
    }
  };

  const handleStickerClick = (id: string) => {
    setActiveStickerID(id);
  };

  const handleDragStart = (e: React.MouseEvent, sticker: Sticker) => {
    e.preventDefault();
    setIsDragging(true);
    setActiveStickerID(sticker.id);

    // Calculate offset from sticker top-left corner
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleResizeStart = (e: React.MouseEvent, sticker: Sticker) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent from triggering drag
    setIsResizing(true);
    setActiveStickerID(sticker.id);
  };

  // Add canvas pan functionality
  const handleCanvasPanStart = (e: React.MouseEvent) => {
    // Only start panning if not interacting with a sticker and middle mouse button or alt+left click
    if (e.target === canvasRef.current && !isDragging && !isResizing &&
        (e.button === 1 || (e.button === 0 && e.altKey))) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      // Update canvas position
      setPosition({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }
    
    if (!isDragging && !isResizing) return;
    if (!activeStickerID || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();

    const activeSticker = stickers.find((s) => s.id === activeStickerID);
    if (!activeSticker) return;

    if (isDragging) {
      // Calculate new position within canvas bounds, accounting for zoom
      const newX = Math.max(0, Math.min(
        ((e.clientX - canvasRect.left - dragOffset.x) / scale) - position.x / scale,
        canvasSize.width / scale - activeSticker.size.width
      ));
      
      const newY = Math.max(0, Math.min(
        ((e.clientY - canvasRect.top - dragOffset.y) / scale) - position.y / scale,
        canvasSize.height / scale - activeSticker.size.height
      ));

      updateStickerPosition(activeStickerID, newX, newY);
    } else if (isResizing) {
      // Calculate new size with minimum size constraints and max bounds
      const newWidth = Math.max(
        50, 
        Math.min(
          ((e.clientX - canvasRect.left) / scale) - position.x / scale - activeSticker.position.x,
          canvasSize.width / scale - activeSticker.position.x
        )
      );
      
      const newHeight = Math.max(
        50, 
        Math.min(
          ((e.clientY - canvasRect.top) / scale) - position.y / scale - activeSticker.position.y,
          canvasSize.height / scale - activeSticker.position.y
        )
      );

      updateStickerSize(activeStickerID, newWidth, newHeight);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsPanning(false);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on canvas, not on a sticker
    if (e.target === canvasRef.current) {
      setActiveStickerID(null);
    }
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // New function to handle editing a sticker
  const handleEditSticker = (sticker: Sticker) => {
    setEditingStickerID(sticker.id);
    setEditContent(sticker.content);
    // Focus the textarea after a short delay to allow the modal to render
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.focus();
      }
    }, 100);
  };

  // Function to save edits
  const handleSaveEdit = () => {
    if (editingStickerID) {
      updateStickerContent(editingStickerID, editContent);
      setEditingStickerID(null);
    }
  };

  // Function to cancel edits
  const handleCancelEdit = () => {
    setEditingStickerID(null);
  };

  // Additional cork texture styling with CSS
  const corkBoardStyle: React.CSSProperties = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a76a' fill-opacity='0.12' fill-rule='evenodd'%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3Ccircle cx='24' cy='24' r='1'/%3E%3Ccircle cx='36' cy='36' r='1'/%3E%3Ccircle cx='48' cy='48' r='1'/%3E%3Ccircle cx='60' cy='60' r='1'/%3E%3Ccircle cx='72' cy='72' r='1'/%3E%3Ccircle cx='84' cy='84' r='1'/%3E%3Ccircle cx='96' cy='96' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundColor: '#d8b78e',
    backgroundBlendMode: 'soft-light',
    boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.2)'
  };

  // Create a function to apply handwriting annotation effect
  const applyHandwritingEffects = () => {
    if (!hasAppliedNotation && textRefs.current.size > 0) {
      const annotations = Array.from(textRefs.current.entries()).map(([id, element]) => {
        // Apply different notation styles based on content type
        const content = stickers.find(s => s.id === id)?.content || '';
        
        if (content.includes('✓')) {
          // For to-do lists, use underline
          return annotate(element, { type: 'underline', color: 'rgba(0,0,0,0.3)', strokeWidth: 2 });
        } else if (content.includes('Ticket') || content.includes('Receipt')) {
          // For tickets, use highlight
          return annotate(element, { type: 'highlight', color: 'rgba(255,251,214,0.7)' });
        } else {
          // For regular notes, use box
          return annotate(element, { 
            type: 'box', 
            color: 'rgba(0,0,0,0.2)', 
            strokeWidth: 1, 
            padding: 2,
            iterations: 2 
          });
        }
      });
      
      // Show all annotations with a staggered effect
      const ag = annotationGroup(annotations);
      ag.show();
      
      setHasAppliedNotation(true);
    }
  };
  
  // Apply notation when stickers change
  useEffect(() => {
    if (stickers.length > 0) {
      // Reset the hasAppliedNotation state when stickers change
      setHasAppliedNotation(false);
      
      // Wait for elements to render
      const timer = setTimeout(() => {
        applyHandwritingEffects();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [stickers]);

  // Add a function to get a random handwriting class
  const getRandomHandwritingClass = (stickerId: string, content: string) => {
    // Deterministic randomness based on sticker ID
    const seed = stickerId.charCodeAt(0) % 3;
    const rotationClass = `hand-rotate-${seed + 1}`;
    
    // Choose font-family based on content type
    let fontClass = 'handwritten-text'; // default
    
    if (content.includes('✓') || content.toLowerCase().includes('visit') || content.toLowerCase().includes('take')) {
      fontClass = 'list-text';
    } else if (content.includes('\n') && 
              (content.includes('Ticket') || 
               content.includes('Receipt') || 
               content.includes('Pass') || 
               content.includes('Bill') ||
               content.includes('$') ||
               content.includes('Total') ||
               content.includes('Rating'))) {
      fontClass = 'ticket-text';
    } else {
      fontClass = 'note-text';
    }
    
    return `${fontClass} ${rotationClass}`;
  };

  const renderSticker = (sticker: Sticker) => {
    const isActive = sticker.id === activeStickerID;
    
    // Ensure sticker stays within canvas bounds
    const adjustedPosition = {
      x: Math.min(sticker.position.x, canvasSize.width / scale - sticker.size.width),
      y: Math.min(sticker.position.y, canvasSize.height / scale - sticker.size.height)
    };
    
    // If position was adjusted, update it in the trip data
    if (adjustedPosition.x !== sticker.position.x || adjustedPosition.y !== sticker.position.y) {
      updateStickerPosition(sticker.id, adjustedPosition.x, adjustedPosition.y);
    }
    
    // Generate a random rotation between -5 and 5 degrees based on the sticker ID for consistent rotation
    const rotationSeed = sticker.id.charCodeAt(0) % 10;
    const rotation = rotationSeed - 5; // Between -5 and 5 degrees
    
    const stickerStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${adjustedPosition.x}px`,
      top: `${adjustedPosition.y}px`,
      width: `${sticker.size.width}px`,
      height: `${sticker.size.height}px`,
      zIndex: isActive ? 100 : 1,
      cursor: isDragging ? 'grabbing' : 'grab',
      transform: `rotate(${rotation}deg)`,
      transformOrigin: 'center center',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    };
    
    // Special case for MAP_OUTLINE
    if (sticker.type === 'label' && sticker.content === 'MAP_OUTLINE') {
      return (
        <div
          key={sticker.id}
          className="bg-white rounded-lg transition-all duration-200"
          style={{
            ...stickerStyle,
            zIndex: 0,
            border: 'none',
            backgroundColor: `${getMoodColorHex(currentTrip?.moodColor || 'blue')}10`,
            transform: 'none', // No rotation for the map
            boxShadow: 'none' // No shadow for the map
          }}
          onClick={() => handleStickerClick(sticker.id)}
          onMouseDown={(e) => handleDragStart(e, sticker)}
        >
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src="/us-outline.svg" 
              alt="US Map Outline"
              className="w-full h-full p-4 opacity-60"
              style={{ 
                filter: `drop-shadow(0px 0px 1px ${getMoodColorHex(currentTrip?.moodColor || 'blue')})`,
              }} 
            />
          </div>
          {isActive && renderStickerControls(sticker)}
        </div>
      );
    }
    
    switch (sticker.type) {
      case 'emoji':
        return (
          <div
            key={sticker.id}
            className="emoji-sticker flex items-center justify-center rounded-full transition-all duration-200"
            style={{
              ...stickerStyle,
              background: 'transparent',
              boxShadow: 'none',
            }}
            onClick={() => handleStickerClick(sticker.id)}
            onMouseDown={(e) => handleDragStart(e, sticker)}
          >
            <span 
              className="transform-gpu select-none emoji-content" 
              style={{ 
                fontSize: `${Math.max(sticker.size.width, sticker.size.height) * 0.6}px`, 
                lineHeight: 1,
                filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))',
                transform: 'scale(1.1)',
              }}
            >
              {sticker.content}
            </span>
            {isActive && renderStickerControls(sticker)}
          </div>
        );
        
      case 'image':
        return (
          <div
            key={sticker.id}
            className="polaroid transition-all duration-200"
            style={{
              ...stickerStyle,
              padding: '10px 10px 30px 10px',
              backgroundColor: 'white',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              border: 'none',
            }}
            onClick={() => handleStickerClick(sticker.id)}
            onMouseDown={(e) => handleDragStart(e, sticker)}
          >
            {/* Tape elements for polaroid effect */}
            <div className="tape tape-left" />
            <div className="tape tape-right" />
            
            <img
              src={sticker.content}
              alt="Memory sticker"
              className="select-none w-full h-full object-cover"
              draggable={false}
              style={{ maxHeight: 'calc(100% - 30px)' }}
            />
            {isActive && renderStickerControls(sticker)}
          </div>
        );
        
      case 'label': {
        // All label types are now general stickers
        const handwritingClass = getRandomHandwritingClass(sticker.id, sticker.content);
        
        // Determine sticker color - light pastel colors work well for notes
        const colors = [
          '#ffffa5', // yellow
          '#ffcfcf', // light pink
          '#cfe8ff', // light blue
          '#d6ffd6', // light green
          '#f2e2ff', // light purple
          '#fff2e2', // light orange
        ];
        
        // Generate a consistent color for each sticker
        const colorIndex = sticker.id.charCodeAt(0) % colors.length;
        const backgroundColor = colors[colorIndex];
        
        return (
          <div
            key={sticker.id}
            className="memory-sticker transition-all duration-200"
            style={{
              ...stickerStyle,
              backgroundColor,
              padding: '12px',
              borderRadius: '2px',
              border: 'none',
              boxShadow: 'none',
              cursor: isDragging ? 'grabbing' : 'text',
            }}
            onClick={() => handleStickerClick(sticker.id)}
            onMouseDown={(e) => handleDragStart(e, sticker)}
            onDoubleClick={() => handleEditSticker(sticker)}
          >
            <div 
              className="pushpin"
              style={{ backgroundColor: getMoodColorHex(currentTrip?.moodColor || 'blue') }}
            />
            
            <p 
              ref={(el) => {
                if (el) textRefs.current.set(sticker.id, el);
                else textRefs.current.delete(sticker.id);
              }}
              className={`select-none text-neo-text whitespace-pre-line ${handwritingClass}`}
              style={{
                textDecoration: sticker.content.includes('✓') ? 'line-through' : 'none',
                // Slightly randomize text size for more organic look
                fontSize: `${0.9 + (sticker.id.charCodeAt(1) % 3) * 0.1}rem`,
                color: 'rgba(0, 0, 0, 0.8)'
              }}
            >
              {sticker.content}
            </p>
            {isActive && renderStickerControls(sticker, true)}
            
            {/* Always visible edit indicator */}
            <div 
              className="absolute bottom-2 right-2 w-8 h-8 bg-white bg-opacity-95 rounded-full flex items-center justify-center cursor-pointer hover:bg-mood-color hover:text-white transition-all duration-200 group hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                handleEditSticker(sticker);
              }}
              style={{
                opacity: 0.95,
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              }}
              title="Edit Text"
            >
              <Edit 
                size={15} 
                strokeWidth={1.5} 
                style={{ color: getMoodColorHex(currentTrip?.moodColor || 'blue') }} 
              />
              <span className="absolute -top-8 bg-black text-white text-xs py-1 px-2 rounded opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                Edit Text
              </span>
            </div>
          </div>
        );
      }
        
      default:
        return null;
    }
  };
  
  const renderStickerControls = (sticker: Sticker, showEditButton = false) => {
    return (
      <>
        {/* Resize handle */}
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-20 rounded-br-lg flex items-center justify-center bg-white bg-opacity-80 shadow-sm"
          onMouseDown={(e) => handleResizeStart(e, sticker)}
        >
          <Maximize size={14} className="text-mood-color" />
        </div>
        
        {/* Delete button */}
        <button
          className="absolute top-0 right-0 bg-white hover:bg-red-50 p-1 rounded-full transform translate-x-1/2 -translate-y-1/2 shadow-md text-red-500 border border-red-200"
          onClick={(e) => {
            e.stopPropagation();
            deleteSticker(sticker.id);
          }}
        >
          <Trash2 size={14} />
        </button>
        
        {/* Drag indicator */}
        <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow-md">
          <Move size={14} className="text-mood-color" />
        </div>
      </>
    );
  };

  const emptyState = () => (
    <div className="h-full w-full flex flex-col items-center justify-center">
      {/* Decorative pins at corners */}
      <div 
        className="absolute top-6 left-6"
        style={{ transform: 'rotate(-5deg)' }}
      >
        <div 
          className="w-4 h-4 rounded-full shadow-md"
          style={{ backgroundColor: getMoodColorHex(currentTrip?.moodColor || 'blue') }}
        />
      </div>
      <div 
        className="absolute top-6 right-6"
        style={{ transform: 'rotate(5deg)' }}
      >
        <div 
          className="w-4 h-4 rounded-full shadow-md"
          style={{ backgroundColor: getMoodColorHex(currentTrip?.moodColor || 'blue') }}
        />
      </div>
      <div 
        className="absolute bottom-6 left-6"
        style={{ transform: 'rotate(-8deg)' }}
      >
        <div 
          className="w-4 h-4 rounded-full shadow-md"
          style={{ backgroundColor: getMoodColorHex(currentTrip?.moodColor || 'blue') }}
        />
      </div>
      <div 
        className="absolute bottom-6 right-6"
        style={{ transform: 'rotate(8deg)' }}
      >
        <div 
          className="w-4 h-4 rounded-full shadow-md"
          style={{ backgroundColor: getMoodColorHex(currentTrip?.moodColor || 'blue') }}
        />
      </div>
      
      {/* Message with call to action */}
      <div className="memory-board-header mb-10">
        <h3 className="text-lg font-bold text-mood-color">
          {currentTrip?.title} Memory Board
        </h3>
      </div>
      
      <div className="bg-white shadow p-6 rounded-xl mb-6 max-w-md">
        <div className="flex items-center justify-center mb-4">
          <MapPin size={40} className="text-mood-color opacity-70" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-center text-neo-text">
          Create Your Memory Board
        </h3>
        <p className="text-center text-neo-text opacity-80 mb-5">
          Pin your travel memories, photos, tickets, and notes to your board. Start by adding a map background or some stickers from the library on the right!
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => addSticker('label', 'MAP_OUTLINE')}
            className="bg-mood-color text-white neo-button px-4 py-2 flex items-center gap-2 hover:bg-opacity-90 transition-all duration-200"
          >
            <MapIcon size={18} />
            <span>Add Map</span>
          </button>
        </div>
      </div>
    </div>
  );
  
  // Generate decorative threads to connect random stickers
  const renderDecorativeThreads = () => {
    // Only render threads if there are at least 3 stickers
    if (stickers.length < 3) return null;
    
    // Create an array to hold thread elements
    const threads = [];
    
    // Get a subset of stickers to connect (max 5 connections)
    const maxConnections = Math.min(5, stickers.length - 1);
    
    for (let i = 0; i < maxConnections; i++) {
      const startIdx = i;
      const endIdx = (i + 1) % stickers.length;
      
      const startSticker = stickers[startIdx];
      const endSticker = stickers[endIdx];
      
      // Calculate the center points of stickers
      const startX = startSticker.position.x + startSticker.size.width / 2;
      const startY = startSticker.position.y + startSticker.size.height / 2;
      const endX = endSticker.position.x + endSticker.size.width / 2;
      const endY = endSticker.position.y + endSticker.size.height / 2;
      
      // Calculate distance and angle
      const dx = endX - startX;
      const dy = endY - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      threads.push(
        <div
          key={`thread-${startIdx}-${endIdx}`}
          className="thread"
          style={{
            left: `${startX}px`,
            top: `${startY}px`,
            width: `${distance}px`,
            transform: `rotate(${angle}deg)`,
            opacity: 0.2,
            backgroundColor: getMoodColorHex(currentTrip?.moodColor || 'blue'),
            height: '1px',
            pointerEvents: 'none'
          }}
        />
      );
    }
    
    return (
      <div className="thread-container">
        {threads}
      </div>
    );
  };

  // Render popup editing modal
  const renderEditModal = () => {
    if (!editingStickerID) return null;
    
    const sticker = stickers.find(s => s.id === editingStickerID);
    if (!sticker) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Blurred background overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
          onClick={handleCancelEdit}
        />
        
        {/* Edit popup */}
        <div 
          className="bg-white rounded-lg shadow-2xl w-full max-w-xl transform transition-all duration-300 animate-rise"
          style={{
            maxHeight: '80vh',
            zIndex: 60
          }}
        >
          <div className="p-5 border-b flex justify-between items-center bg-mood-color text-white">
            <h3 className="text-xl font-medium">Edit Note</h3>
            <button 
              onClick={handleCancelEdit}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-colors"
            >
              <X size={22} />
            </button>
          </div>
          
          <div className="p-6">
            <textarea
              ref={editTextareaRef}
              className="w-full h-60 p-4 border rounded-md focus:ring-2 focus:ring-mood-color focus:border-mood-color resize-none text-lg"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Add your note here..."
              style={{
                fontFamily: "'Indie Flower', cursive",
                lineHeight: 1.5
              }}
            />
          </div>
          
          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
            <button 
              onClick={handleCancelEdit}
              className="px-5 py-2.5 border rounded-md text-gray-700 hover:bg-gray-100 text-base"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveEdit}
              className="px-5 py-2.5 bg-mood-color text-white rounded-md hover:bg-opacity-90 flex items-center gap-2 text-base"
            >
              <Check size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Improved export function
  const handleExportImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!canvasRef.current) return;
    
    try {
      setIsExporting(true);
      
      // Store original view state
      const originalScale = scale;
      const originalPosition = {...position};
      
      // Reset view for capture
      setScale(1);
      setPosition({ x: 0, y: 0 });
      
      // Wait for the render to complete with updated transforms
      setTimeout(async () => {
        try {
          // Create a completely new element for the screenshot
          const screenshotContainer = document.createElement('div');
          screenshotContainer.style.position = 'fixed';
          screenshotContainer.style.top = '0';
          screenshotContainer.style.left = '0';
          screenshotContainer.style.width = `${canvasSize.width}px`;
          screenshotContainer.style.height = `${canvasSize.height}px`;
          screenshotContainer.style.zIndex = '-9999';
          screenshotContainer.style.pointerEvents = 'none';
          
          // Add cork background
          screenshotContainer.style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a76a' fill-opacity='0.12' fill-rule='evenodd'%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3Ccircle cx='24' cy='24' r='1'/%3E%3Ccircle cx='36' cy='36' r='1'/%3E%3Ccircle cx='48' cy='48' r='1'/%3E%3Ccircle cx='60' cy='60' r='1'/%3E%3Ccircle cx='72' cy='72' r='1'/%3E%3Ccircle cx='84' cy='84' r='1'/%3E%3Ccircle cx='96' cy='96' r='1'/%3E%3C/g%3E%3C/svg%3E")`;
          screenshotContainer.style.backgroundColor = '#d8b78e';
          screenshotContainer.style.backgroundBlendMode = 'soft-light';
          
          document.body.appendChild(screenshotContainer);
          
          // Add the header
          if (currentTrip && stickers.length > 0) {
            const headerDiv = document.createElement('div');
            headerDiv.style.position = 'absolute';
            headerDiv.style.top = '20px';
            headerDiv.style.left = '50%';
            headerDiv.style.transform = 'translateX(-50%)';
            headerDiv.style.zIndex = '10';
            headerDiv.style.background = 'white';
            headerDiv.style.padding = '8px 16px';
            headerDiv.style.borderRadius = '4px';
            headerDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            
            const headerText = document.createElement('h3');
            headerText.style.fontSize = '18px';
            headerText.style.fontWeight = 'bold';
            headerText.style.color = getMoodColorHex(currentTrip.moodColor || 'blue');
            headerText.textContent = `${currentTrip.title || "New Trip"} - Day ${currentDay + 1}`;
            
            headerDiv.appendChild(headerText);
            screenshotContainer.appendChild(headerDiv);
          }
          
          // Collect all image promises to wait for loading
          const imagePromises: Promise<void>[] = [];
          
          // Manually render each sticker to the container
          stickers.forEach(sticker => {
            const stickerDiv = document.createElement('div');
            
            // Basic positioning for all sticker types
            stickerDiv.style.position = 'absolute';
            stickerDiv.style.left = `${sticker.position.x}px`;
            stickerDiv.style.top = `${sticker.position.y}px`;
            stickerDiv.style.width = `${sticker.size.width}px`;
            stickerDiv.style.height = `${sticker.size.height}px`;
            
            // Generate rotation
            const rotationSeed = sticker.id.charCodeAt(0) % 10;
            const rotation = rotationSeed - 5;
            stickerDiv.style.transform = `rotate(${rotation}deg)`;
            stickerDiv.style.transformOrigin = 'center center';
            
            // Render different sticker types
            if (sticker.type === 'label' && sticker.content === 'MAP_OUTLINE') {
              stickerDiv.style.backgroundColor = `${getMoodColorHex(currentTrip?.moodColor || 'blue')}10`;
              stickerDiv.style.borderRadius = '8px';
              stickerDiv.style.transform = 'none';
              
              const mapImg = document.createElement('img');
              mapImg.src = '/us-outline.svg';
              mapImg.alt = 'US Map Outline';
              mapImg.style.width = '100%';
              mapImg.style.height = '100%';
              mapImg.style.padding = '16px';
              mapImg.style.opacity = '0.6';
              mapImg.style.filter = `drop-shadow(0px 0px 1px ${getMoodColorHex(currentTrip?.moodColor || 'blue')})`;
              
              // Create promise for image loading
              const imagePromise = new Promise<void>((resolve) => {
                mapImg.onload = () => resolve();
                mapImg.onerror = () => resolve();
                // Safari sometimes doesn't fire these events
                setTimeout(resolve, 500);
              });
              imagePromises.push(imagePromise);
              
              stickerDiv.appendChild(mapImg);
            } 
            else if (sticker.type === 'emoji') {
              stickerDiv.style.display = 'flex';
              stickerDiv.style.alignItems = 'center';
              stickerDiv.style.justifyContent = 'center';
              stickerDiv.style.background = 'transparent';
              
              const emojiSpan = document.createElement('span');
              emojiSpan.textContent = sticker.content;
              emojiSpan.style.fontSize = `${Math.max(sticker.size.width, sticker.size.height) * 0.6}px`;
              emojiSpan.style.lineHeight = '1';
              emojiSpan.style.filter = 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))';
              emojiSpan.style.transform = 'scale(1.1)';
              
              stickerDiv.appendChild(emojiSpan);
            }
            else if (sticker.type === 'image') {
              stickerDiv.style.padding = '10px 10px 30px 10px';
              stickerDiv.style.backgroundColor = 'white';
              stickerDiv.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
              stickerDiv.className = 'polaroid';
              
              // Add tape elements
              const tapeLeft = document.createElement('div');
              tapeLeft.className = 'tape-left';
              tapeLeft.style.position = 'absolute';
              tapeLeft.style.top = '-10px';
              tapeLeft.style.left = '10px';
              tapeLeft.style.width = '30px';
              tapeLeft.style.height = '20px';
              tapeLeft.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
              tapeLeft.style.transform = 'rotate(-5deg)';
              
              const tapeRight = document.createElement('div');
              tapeRight.className = 'tape-right';
              tapeRight.style.position = 'absolute';
              tapeRight.style.top = '-10px';
              tapeRight.style.right = '10px';
              tapeRight.style.width = '30px';
              tapeRight.style.height = '20px';
              tapeRight.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
              tapeRight.style.transform = 'rotate(5deg)';
              
              stickerDiv.appendChild(tapeLeft);
              stickerDiv.appendChild(tapeRight);
              
              const img = document.createElement('img');
              img.src = sticker.content;
              img.alt = 'Memory photo';
              img.crossOrigin = 'anonymous'; // Handle CORS for images
              img.style.width = '100%';
              img.style.height = '100%';
              img.style.maxHeight = 'calc(100% - 30px)';
              img.style.objectFit = 'cover';
              
              // Create promise for image loading
              const imagePromise = new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
                // Safari sometimes doesn't fire these events
                setTimeout(resolve, 500);
              });
              imagePromises.push(imagePromise);
              
              stickerDiv.appendChild(img);
            }
            else if (sticker.type === 'label') {
              // Label sticker (notes)
              const colorIndex = sticker.id.charCodeAt(0) % 6;
              const colors = ['#ffffa5', '#ffcfcf', '#cfe8ff', '#d6ffd6', '#f2e2ff', '#fff2e2'];
              stickerDiv.style.backgroundColor = colors[colorIndex];
              stickerDiv.style.padding = '12px';
              stickerDiv.style.borderRadius = '2px';
              
              // Add pushpin
              const pushpin = document.createElement('div');
              pushpin.className = 'pushpin';
              pushpin.style.position = 'absolute';
              pushpin.style.top = '5px';
              pushpin.style.left = '50%';
              pushpin.style.transform = 'translateX(-50%)';
              pushpin.style.width = '8px';
              pushpin.style.height = '8px';
              pushpin.style.borderRadius = '50%';
              pushpin.style.backgroundColor = getMoodColorHex(currentTrip?.moodColor || 'blue');
              pushpin.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)';
              
              stickerDiv.appendChild(pushpin);
              
              // Add text content
              const textP = document.createElement('p');
              textP.style.whiteSpace = 'pre-line';
              textP.style.color = 'rgba(0, 0, 0, 0.8)';
              textP.textContent = sticker.content;
              
              // Apply handwriting styles
              const handwritingClass = sticker.id.charCodeAt(0) % 3;
              const fontFamilies = [
                "'Indie Flower', cursive",
                "'Shadows Into Light', cursive",
                "'Caveat', cursive"
              ];
              
              textP.style.fontFamily = fontFamilies[handwritingClass];
              textP.style.fontSize = `${0.9 + (sticker.id.charCodeAt(1) % 3) * 0.1}rem`;
              if (sticker.content.includes('✓')) {
                textP.style.textDecoration = 'line-through';
              }
              
              stickerDiv.appendChild(textP);
            }
            
            screenshotContainer.appendChild(stickerDiv);
          });
          
          // Wait for all images to load
          await Promise.all(imagePromises);
          
          // Add a small delay for Safari
          if (isSafari()) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
          
          // Use multiple attempts to generate the PNG
          const retryAttempts = isSafari() ? 5 : 3;
          const dataUrl = await generatePngWithRetry(screenshotContainer, {
            backgroundColor: '#f5f1e6',
            width: canvasSize.width,
            height: canvasSize.height,
            pixelRatio: 3,
            quality: 0.95,
            cacheBust: true
          }, retryAttempts);
          
          // Clean up
          document.body.removeChild(screenshotContainer);
          
          if (dataUrl) {
            // Create download link with nice filename
            const link = document.createElement('a');
            const tripName = currentTrip?.title?.replace(/\s+/g, '_').toLowerCase() || 'trip';
            const date = new Date().toISOString().split('T')[0];
            const fileName = `${tripName}_day${currentDay + 1}_${date}.png`;
            
            link.download = fileName;
            link.href = dataUrl;
            link.click();
          } else {
            console.error('Failed to generate image');
          }
        } catch (err) {
          console.error('Error generating image:', err);
        } finally {
          // Restore original view and clear loading state
          setScale(originalScale);
          setPosition(originalPosition);
          setIsExporting(false);
        }
      }, 200);
    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
    }
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden rounded-lg transition-all duration-200 cork-board"
      style={{ zIndex: 0 }}
    >
      {/* Mobile Experience Notice */}
      {isMobile && (
        <MobileNotice colorHex={getMoodColorHex(currentTrip?.moodColor || 'blue')} />
      )}

      {/* Title Header */}
      {stickers.length > 0 && currentTrip && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="memory-board-header">
            <h3 className="text-lg font-bold text-mood-color">
              {currentTrip.title || "New Trip"} - Day {currentDay + 1}
            </h3>
          </div>
        </div>
      )}
    
      <div
        ref={canvasRef}
        className="absolute inset-0 focus:outline-none"
        tabIndex={0}
        onMouseDown={isMobile ? undefined : handleCanvasPanStart}
        onMouseUp={isMobile ? undefined : handleMouseUp}
        onMouseMove={isMobile ? undefined : handleMouseMove}
        onMouseLeave={isMobile ? undefined : handleMouseUp}
        onWheel={isMobile ? undefined : handleWheel}
        onClick={isMobile ? undefined : handleCanvasClick}
        style={{
          overflow: 'hidden', // Prevent scroll on the canvas
          cursor: isPanning ? 'grabbing' : 'default',
          zIndex: 1,
          filter: editingStickerID ? 'blur(3px)' : 'none',
          transition: 'filter 0.3s ease',
          pointerEvents: isMobile ? 'none' : 'auto' // Disable interactions on mobile
        }}
      >
        {/* Render the canvas content with transformation */}
        <div
          className="absolute"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: '0 0',
            width: '100%',
            height: '100%'
          }}
        >
          {stickers.length === 0 ? emptyState() : (
            <>
              {renderDecorativeThreads()}
              {stickers.map(sticker => renderSticker(sticker))}
            </>
          )}
        </div>

        {/* Updated controls with export button - hidden on mobile */}
        {!isMobile && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10 bg-white bg-opacity-80 rounded-lg p-1.5 shadow-md">
            <button
              onClick={handleZoomOut}
              className="text-mood-color p-1 rounded hover:bg-mood-color-10 transition-colors"
              aria-label="Zoom out"
              disabled={isExporting}
            >
              <ZoomOut size={18} />
            </button>
            <button
              onClick={handleResetZoom}
              className="text-mood-color p-1 rounded hover:bg-mood-color-10 transition-colors"
              aria-label="Reset zoom"
              disabled={isExporting}
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={handleZoomIn}
              className="text-mood-color p-1 rounded hover:bg-mood-color-10 transition-colors"
              aria-label="Zoom in"
              disabled={isExporting}
            >
              <ZoomIn size={18} />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <button
              onClick={handleExportImage}
              className="text-mood-color p-1 rounded hover:bg-mood-color-10 transition-colors flex items-center gap-1"
              aria-label="Export as image"
              title="Export as image"
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Download size={18} />
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Edit Modal - only shown on desktop */}
      {!isMobile && renderEditModal()}
    </div>
  );
};

export default MemoryCanvas;
