"use client";

import dynamic from 'next/dynamic';

// Dynamically load the Leaflet map so it only runs in the browser (client-side)
// This prevents Next.js Server-Side Rendering errors since Leaflet requires the 'window' object
const MapComponent = dynamic(() => import('./MapLogic'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-pawprint-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500">Loading Map...</p>
      </div>
    </div>
  )
});

export function InteractiveMap() {
  return (
    <div className="relative w-full h-full">
      {/* Overlay Title */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-gray-100 shadow-sm inline-block">
          <h2 className="text-sm font-bold text-gray-900 mb-0.5">Live Alert Map</h2>
          <p className="text-[10px] text-gray-500">Real-time sightings and lost pets</p>
        </div>
      </div>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-[10px] font-bold text-gray-900 mb-3 uppercase tracking-wider">Map Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></div>
               <span className="text-[11px] font-medium text-gray-600">Lost Pet</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-pawprint-green border border-white shadow-sm"></div>
               <span className="text-[11px] font-medium text-gray-600">Sighted</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-[#f59e0b] border border-white shadow-sm"></div>
               <span className="text-[11px] font-medium text-gray-600">Reunited</span>
            </div>
          </div>
        </div>
      </div>

      <MapComponent />
    </div>
  );
}
