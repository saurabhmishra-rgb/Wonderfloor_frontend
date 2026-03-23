import React, { useState, useRef, useEffect } from 'react';

// --- Corrected imports matching your VS Code sidebar ---
import actonImg from '../assets/image1.jpeg';
import holmesImg from '../assets/image2.jpeg';
import cedarImg from '../assets/image3.jpeg';
import fayeImg from '../assets/image4.jpeg';
import callaImg from '../assets/image5.jpeg';
import tansyImg from '../assets/image6.jpeg';
// Note: If you have a 7th image for Poppy, import it here. 
// For now, I'll map Poppy to image1 to prevent errors.
import poppyImg from '../assets/image1.jpeg'; 

const ARVisualizer = ({ closeModal, initialImage }) => {
  // --- Updated Mock Data using Imported Local Assets ---
  const mockProducts = [
    { id: 1, name: 'Acton', size: '6cm x 36cm', img: actonImg },
    { id: 2, name: 'Holmes', size: '6cm x 36cm', img: holmesImg },
    { id: 3, name: 'Cedar', size: '6cm x 36cm', img: cedarImg },
    { id: 4, name: 'Faye', size: '6cm x 36cm', img: fayeImg },
    { id: 5, name: 'Calla', size: '6cm x 136cm', img: callaImg },
    { id: 6, name: 'Tansy', size: '6cm x 36cm', img: tansyImg },
    { id: 7, name: 'Poppy1', size: '6cm x 36cm', img: poppyImg }, 
  ];

  // --- State ---
  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0]);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // --- Zoom & Pan State ---
  const [zoomScale, setZoomScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);

  // --- Mouse Scroll Zoom Logic ---
  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault(); // Prevents the whole page from scrolling when zooming
      setZoomScale(prev => {
        // e.deltaY detects scroll wheel movement
        const newScale = prev - (e.deltaY * 0.002);
        const clampedScale = Math.min(Math.max(1, newScale), 5); // Allow up to 5x zoom
        
        // Reset pan position back to center when zoomed all the way out
        if (clampedScale === 1) setPan({ x: 0, y: 0 });
        
        return clampedScale;
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // --- Click & Drag Pan Logic ---
  const handleMouseDown = (e) => {
    if (zoomScale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUpOrLeave = () => setIsDragging(false);

  // --- API Logic ---
  const handleTileSelection = async (product) => {
    setSelectedProduct(product);
    if (!initialImage?.rawFile) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('roomImage', initialImage.rawFile);
    formData.append('tileName', product.name);

    try {
      const response = await fetch('https://ethereal-1700-vision-ai-backend.hf.space/api/process-room', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.processedUrl) {
        setProcessedImage(data.processedUrl); 
      } else {
        console.error("AI Engine Error:", data.error);
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f9fafb] flex z-50 overflow-hidden font-sans text-gray-800">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col shadow-sm z-20 shrink-0 h-full">
        
        {/* Logo Section */}
        <div className="p-5 flex justify-between items-center border-b border-gray-100">
          <img 
            src="https://www.wonderfloor.co.in/assets/img/logo/logo.png" 
            alt="Wonderfloor Logo" 
            className="h-8 max-w-[180px] object-contain" 
          />
          <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>

        {/* Categories Section */}
        <div className="px-5 pt-4 pb-4">
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-sm font-medium text-gray-700">
              <div className="w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center text-white">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              Floors
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="px-5 pb-4 flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            1
          </button>
          <div className="flex border border-gray-300 rounded overflow-hidden">
            <button className="w-10 h-10 flex items-center justify-center bg-gray-700 text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white text-gray-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 flex flex-col gap-3 custom-scrollbar">
          {mockProducts.map((prod) => (
            <div 
              key={prod.id} 
              onClick={() => handleTileSelection(prod)}
              className={`flex gap-4 p-3 border rounded-lg cursor-pointer transition-all relative ${
                selectedProduct.name === prod.name ? 'border-[#0b5e5e] shadow-sm bg-[#0b5e5e]/5' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="relative shrink-0">
                <img src={prod.img} alt={prod.name} className="w-20 h-20 object-cover rounded shadow-sm bg-gray-100" />
                <button className="absolute top-1 right-1 bg-black/30 hover:bg-black/50 p-1 rounded-full text-white backdrop-blur-sm transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-[11px] text-gray-500 uppercase tracking-wide">Wonderfloor</span>
                <span className="font-bold text-sm text-gray-900 truncate mt-0.5">{prod.name}</span>
                <span className="text-xs text-gray-500 mt-1">Size: {prod.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RIGHT MAIN AREA ================= */}
      <div className="flex-1 flex flex-col bg-[#e5e7eb] h-full overflow-hidden relative">
        
        {/* Top Action Bar */}
        <div className="h-[60px] bg-white border-b border-gray-200 flex justify-between items-center px-4 shadow-sm z-10 shrink-0">
          
          <button onClick={closeModal} className="flex items-center gap-2 text-gray-600 hover:text-black text-sm font-medium px-2 border-r border-gray-200 pr-6 h-full transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            Exit
          </button>

          <div className="flex items-center gap-6 text-sm text-gray-600 font-medium">
            <button className="flex items-center gap-2 hover:text-black transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5M4 20L20 4M21 16v5h-5M15 15l6 6M4 4l5 5"></path></svg> Compare</button>
            <button className="flex items-center gap-2 hover:text-black transition-colors cursor-default">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> 
              Zoom {zoomScale > 1 ? `(${zoomScale.toFixed(1)}x)` : ''}
            </button>
            <button className="flex items-center gap-2 hover:text-black transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> Share</button>
            <button className="flex items-center gap-2 hover:text-black transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download</button>
          </div>

          <div className="flex items-center gap-4 border-l border-gray-200 pl-6 h-full">
            <button className="bg-[#0b5e5e] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#084747] flex items-center gap-2 shadow-sm transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Change Room
            </button>
            <button className="text-gray-600 hover:text-black text-sm font-medium flex items-center gap-1 transition-colors">
              Menu
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
            </button>
          </div>
        </div>

        {/* ================= NEW: UNIFIED IMAGE & FOOTER WRAPPER ================= */}
        {/* WIDER: Padding reduced (p-2 md:px-3) so the container stretches left and right! */}
        <div className="flex-1 relative flex items-center justify-center p-2 md:px-3 md:py-4 overflow-hidden">
            
            {/* WIDER: max-w changed to 98% to let it stretch almost completely to the edges */}
            <div 
              className="relative flex flex-col bg-white shadow-xl rounded-md overflow-hidden  max-w-[98%]"
              style={{ 
                aspectRatio: '4/3', 
                maxHeight: '100%' 
              }}
            >
                
                {/* 1. Zoomable Image Section */}
                <div 
                  ref={imageContainerRef}
                  className="flex-1 relative overflow-hidden bg-gray-200"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  // CURSOR LOGIC: Zoom-in glass at standard size. Grab hand when zoomed. Closed hand when dragging.
                  style={{ cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
                >
                    
                    {isProcessing && (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex flex-col justify-center items-center z-40">
                        <div className="w-12 h-12 border-4 border-[#0b5e5e]/20 border-t-[#0b5e5e] rounded-full animate-spin mb-4"></div>
                        <p className="text-[#0b5e5e] font-bold text-lg drop-shadow-md">Applying Wonderfloor...</p>
                      </div>
                    )}

                    <img 
                      src={processedImage || initialImage?.previewUrl || 'https://images.unsplash.com/photo-1595844730298-b960fa25fa48?auto=format&fit=crop&w=1200&q=80'} 
                      alt="Room view" 
                      draggable="false" // FIX: Prevents the browser from accidentally "dragging" the raw image file
                      className="w-full h-full object-cover select-none" // select-none prevents highlighting issues
                      style={{ 
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomScale})`,
                        transformOrigin: 'center center',
                        // Smooth zoom transition, but instant when dragging
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out' 
                      }}
                    />
                </div>

                {/* 2. Attached Footer Bar */}
                <div className="h-[60px] md:h-[70px] bg-white border-t border-gray-200 px-4 md:px-6 shrink-0 flex items-center justify-between z-20 relative">
                    
                    {/* Selected Product */}
                    <div className="flex items-center gap-3">
                      <img src={selectedProduct.img} alt="Current" className="w-10 h-10 object-cover rounded shadow-sm border border-gray-200" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Wonderfloor</span>
                        <span className="text-sm font-bold text-gray-900">{selectedProduct.name}</span>
                      </div>
                    </div>

                    {/* Centered Footer Logo */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-80 pointer-events-none hidden sm:flex">
                      <span className="text-[9px] font-semibold text-gray-400 mb-0.5 tracking-wider uppercase">Powered by</span>
                      <img src="https://www.wonderfloor.co.in/assets/img/logo/logo.png" alt="Wonderfloor Logo" className="h-3 object-contain" />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4 md:gap-6">
                      <button 
                        onClick={() => { setZoomScale(1); setPan({x:0, y:0}); }} 
                        className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors cursor-pointer"
                      >
                        <span className="text-sm font-medium">Reset</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>
                      </button>
                      <div className="w-[1px] h-6 bg-gray-300"></div>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors cursor-pointer">
                        <span className="text-sm font-medium">Rotate</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.13 15.57a9 9 0 1 0 3.87-11.23l-3.5 3.5"></path></svg>
                      </button>
                    </div>

                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default ARVisualizer;
