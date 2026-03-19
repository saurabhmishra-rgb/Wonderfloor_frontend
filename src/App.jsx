import React, { useState, useRef, useEffect } from 'react';
import ARVisualizer from './components/ARVisualizer'; 

// --- 1. Import all local images from your assets folder ---
import Hospital from './assets/Hospital_02.jpg';
import office02 from './assets/Office-Flooring_02.jpg';
import residential03 from './assets/Residential-Flooring_03.jpg';
import school03 from './assets/School-Flooring_03.jpg';
import superMarket01 from './assets/Super-Market-Flooring_01.jpg';


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomImage, setSelectedRoomImage] = useState(null);
  
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null); // Added a reference for the dropdown container

  // --- Dropdown State ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('USER INDUSTRY');

  // --- Click Outside to Close Logic ---
  useEffect(() => {
    function handleClickOutside(event) {
      // If the dropdown is open AND the click happened outside of the dropdownRef element
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // --- Industry Data ---
  const industries = [
    "Industrial Flooring",
    "Office Flooring",
    "Residential Flooring",
    "School Flooring",
    "Sports Flooring",
    "Supermarket Flooring",
    "Transport Flooring",
    "Hospital Flooring",
    "Auditorium Flooring",
    "Hotel/ Hospitality Flooring",
    "Luxury Vinyl Tile"
  ];

  // --- 2. Update demoRooms to use the imported local images ---
  const demoRooms = [
    { id: 2, name: 'Hospital', img: Hospital },
    { id: 4, name: 'Office Space', img: office02 },
    { id: 7, name: 'Residential', img: residential03 },
    // { id: 8, name: 'Sports', img: Sports },
    { id: 10, name: 'School-Flooring', img: school03 },
    { id: 11, name: 'Supermarket', img: superMarket01 },
  ];

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedRoomImage({ previewUrl: URL.createObjectURL(file), isDemo: false, rawFile: file });
      setIsModalOpen(true);
    }
  };

  // --- 3. Updated Demo Click Handler ---
  const handleDemoRoomClick = async (imgUrl) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const file = new File([blob], "demo_room.jpg", { type: "image/jpeg" });
      
      setSelectedRoomImage({ previewUrl: imgUrl, isDemo: true, rawFile: file });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to load demo image:", error);
      alert("Could not load the demo room. Check if the image path is correct.");
    }
  };

  return (
    <div className="relative max-w-[1300px] mx-auto px-4 sm:px-6 py-12 font-sans text-gray-800 bg-white min-h-screen flex flex-col overflow-x-hidden">
      
      {/* Top Section: Responsive Stack to Side-by-Side */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-16 mt-16 sm:mt-20 md:mt-24 mb-16 sm:mb-24 w-full">
        
        {/* Left Column - Heading & Controls */}
        <div className="w-full lg:w-[450px] flex flex-col gap-6 shrink-0 mt-8 lg:mt-0 lg:-mt-2">
          
          <h1 className="text-[36px] sm:text-[40px] lg:text-[46px] font-bold text-[#202938] mb-2 tracking-tight text-center lg:text-left leading-tight">
            See live floor transformation in your room
          </h1>

          <ul className="text-[15px] sm:text-[16px] text-gray-600 space-y-4 font-medium mb-2">
            <li className="flex items-center gap-3 justify-center lg:justify-start">
              <svg className="w-6 h-6 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Upload a picture of your room
            </li>
            <li className="flex items-center gap-3 justify-center lg:justify-start">
              <svg className="w-6 h-6 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
              Try our products in your room
            </li>
          </ul>
          
          {/* Primary Upload Button */}
          <button 
            onClick={handleUploadClick}
            className="cursor-pointer bg-[#0c5bc6] hover:bg-[#09479e] text-white font-bold py-3.5 px-6 rounded-[8px] border-[2.5px] border-[#4b8cf3] text-[17px] tracking-wide transition duration-200 w-full lg:w-[340px] flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-[26px] h-[26px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h3v2H5v13h14V9h-2V7h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
              <path d="M12 20a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0-2a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM9 2h2v3H9V2zM7 4V2h2v2H7z" />
            </svg>
            Upload
          </button>
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        {/* Right Column - Mock UI Graphic */}
        <div className="hidden lg:flex flex-1 w-full bg-[#6a6a6a] h-[400px] rounded-none relative overflow-hidden shadow-sm select-none">
          {/* Inner Light Gray Wall */}
          <div className="absolute top-12 left-12 right-12 bottom-20 bg-[#e6e6e6] rounded-none"></div>
          
          {/* Floor */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#555555]"></div>
          
          {/* Left White Drawer Element */}
          <div className="absolute bottom-20 left-36 w-56 h-24 bg-white flex justify-center pt-3 shadow-sm border border-gray-100">
             <div className="w-12 h-3.5 bg-[#cbd5e1] rounded-full"></div>
             {/* Checkmark Circle */}
             <div className="absolute bottom-4 right-12 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
             </div>
          </div>

          {/* Right Brown Boxes Element */}
          <div className="absolute bottom-20 right-24 w-48 h-32 bg-[#b48d66] flex flex-wrap border-t border-l border-[#9c7956]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-1/2 h-1/2 border-r border-b border-[#9c7956] flex items-center pl-3 relative">
                <div className="w-2 h-2 rounded-full bg-white/60"></div>
                {/* Overlay Checkmark */}
                {i === 4 && (
                  <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center">
                    <div className="w-3.5 h-3.5 border-2 border-blue-400 rounded-sm"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Top floating White Search/Filter Box */}
          <div className="absolute top-20 left-36 w-64 h-14 bg-white flex items-center px-5 shadow-sm border border-gray-100">
            <div className="w-24 h-2 bg-gray-200 rounded-full"></div>
            {/* Outline Circle */}
            <div className="absolute top-3 -right-4 w-8 h-8 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center shadow-sm">
               <div className="w-3 h-3 border-2 border-blue-400 rounded-sm"></div>
            </div>
          </div>

          {/* Left Side Floating Menu Overlay */}
          <div className="absolute left-16 top-16 w-[70px] bg-[#e2e2e2] rounded-lg shadow-lg flex flex-col items-center py-4 gap-4 z-10 border border-gray-300">
             <div className="w-12 h-12 border-[3px] border-[#fc6c3f] bg-[#9cbdb9] rounded-sm relative"></div>
             <div className="w-12 h-12 bg-[#557e87] rounded-sm relative">
                <svg className="absolute -bottom-5 -right-5 w-10 h-10 text-white drop-shadow-md z-20" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21a.5.5 0 01-.5-.5v-4.79l-2.15 2.15a.5.5 0 01-.7 0l-1.41-1.42a.5.5 0 010-.7l6.06-6.06a.5.5 0 01.7 0l6.06 6.06a.5.5 0 010 .7l-1.41 1.41a.5.5 0 01-.7 0L17.5 15.71V20.5a.5.5 0 01-.5.5h-3.5zM4 10.5a6.5 6.5 0 1113 0H4z" /></svg>
             </div>
             <div className="w-12 h-12 bg-white rounded-sm shadow-inner"></div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Demo Rooms Grid */}
      <div className="flex-grow">
        
        {/* === HEADER & DROPDOWN CONTAINER === */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 relative z-30 gap-4">
          
          <h3 className="text-[18px] sm:text-[20px] font-bold text-gray-400">
            Don't have a picture? Try our demo rooms instead
          </h3>
          
          {/* USER INDUSTRY DROPDOWN */}
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer flex items-center justify-between sm:justify-center gap-2 bg-[#6a6a6a] text-white px-5 py-3 sm:py-2.5 rounded text-[13px] font-bold tracking-wide transition-colors hover:bg-gray-600 uppercase w-full sm:w-auto"
            >
              {selectedIndustry}
              <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-full sm:w-64 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-t-[3px] border-[#fc6c3f] py-2 z-50 rounded-b max-h-[300px] overflow-y-auto">
                {industries.map((industry, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedIndustry(industry);
                      setIsDropdownOpen(false);
                    }}
                    className={`cursor-pointer w-full text-left px-5 py-2.5 text-[15px] transition-colors ${
                      selectedIndustry === industry || (selectedIndustry === 'USER INDUSTRY' && index === 0)
                        ? 'text-[#fc6c3f]' 
                        : 'text-gray-600 hover:text-[#fc6c3f] hover:bg-gray-50'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 relative z-10">
          {demoRooms.map((room) => (
            <div 
              key={room.id} 
              className="cursor-pointer group flex flex-col gap-3"
              onClick={() => handleDemoRoomClick(room.img)}
            >
              <div className="overflow-hidden rounded-none bg-gray-100">
                <img 
                  src={room.img} 
                  alt={room.name} 
                  className="w-full h-[200px] object-cover hover:opacity-90 transition-opacity duration-200" 
                />
              </div>
              <p className="text-[12px] text-[#0b5c58] font-bold uppercase tracking-wider px-1">
                {room.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= NEW FOOTER LOGO ================= */}
      <div className="w-full flex justify-center items-center py-10 mt-auto">
        <img 
          src="https://www.wonderfloor.co.in/assets/img/logo/logo.png" 
          alt="Wonderfloor Logo" 
          className="h-10 object-contain opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>

      {/* AR Modal Overlay */}
      {isModalOpen && (
        <ARVisualizer 
           closeModal={() => setIsModalOpen(false)} 
           initialImage={selectedRoomImage} 
        />
      )}
    </div>
  );
}

export default App;
