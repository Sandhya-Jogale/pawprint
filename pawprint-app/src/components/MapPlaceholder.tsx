import { MapPin } from "lucide-react";

export function MapPlaceholder() {
  return (
    <div className="flex-1 bg-white rounded-3xl m-4 relative overflow-hidden shadow-lg border border-gray-100 flex items-center justify-center">
      
      {/* Floating Header */}
      <div className="absolute top-6 left-6 bg-white rounded-xl shadow-md border border-gray-100 p-4 z-10">
        <h2 className="text-sm font-bold text-gray-900 mb-0.5">Live Sighting Map</h2>
        <p className="text-[10px] text-gray-500">Click markers for details</p>
      </div>

      {/* Floating Legend */}
      <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-md border border-gray-100 p-4 z-10 w-48">
        <h3 className="text-[10px] font-bold text-gray-900 mb-3 uppercase tracking-wider">Map Legend</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-pawprint-green flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span className="text-[11px] text-gray-600 font-medium">Sightings</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-[#f59e0b] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span className="text-[11px] text-gray-600 font-medium">Lost</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-[#fde047] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span className="text-[11px] text-gray-600 font-medium flex-1">Reunited</span>
            <span className="text-[#d97706] bg-[#fef3c7] text-[8px] font-bold px-1.5 py-0.5 rounded">Social Proof</span>
          </div>
        </div>
      </div>

      {/* Dummy Map Background elements to make it look like a map UI without an actual map */}
      <div className="absolute inset-0 bg-[#fafafa]">
         <div className="w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>

      {/* Scattered Pins Container */}
      <div className="relative w-full h-full max-w-2xl max-h-[500px]">
        {/* Sighting Pins (Green) */}
        <div className="absolute top-[40%] left-[30%]">
           <MapPin className="w-8 h-8 text-pawprint-green fill-pawprint-green drop-shadow-md" />
           <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
        </div>
        
        <div className="absolute top-[60%] left-[35%]">
           <MapPin className="w-8 h-8 text-pawprint-green fill-pawprint-green drop-shadow-md" />
           <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
        </div>

        <div className="absolute top-[55%] left-[45%]">
           <MapPin className="w-8 h-8 text-pawprint-green fill-pawprint-green drop-shadow-md" />
           <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
        </div>

        {/* Lost Pins (Orange) */}
        <div className="absolute top-[35%] left-[40%]">
           <MapPin className="w-8 h-8 text-[#f59e0b] fill-[#f59e0b] drop-shadow-md" />
           <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
        </div>

        <div className="absolute top-[25%] left-[55%]">
           <MapPin className="w-8 h-8 text-[#f59e0b] fill-[#f59e0b] drop-shadow-md" />
           <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
        </div>

        {/* Reunited Pins (Yellow) */}
        <div className="absolute top-[30%] left-[45%]">
           <MapPin className="w-8 h-8 text-[#fde047] fill-[#fde047] drop-shadow-md" />
           <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
        </div>

        <div className="absolute top-[50%] left-[48%]">
           <MapPin className="w-8 h-8 text-[#fde047] fill-[#fde047] drop-shadow-md" />
           <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
        </div>

        <div className="absolute top-[65%] left-[52%]">
           <MapPin className="w-8 h-8 text-[#fde047] fill-[#fde047] drop-shadow-md" />
           <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
        </div>

        {/* Highlight Ripple Effect on one of the pins */}
        <div className="absolute top-[50%] left-[48%] -mt-4 -ml-4 w-16 h-16 border-4 border-[#fde047] rounded-full opacity-30 animate-ping"></div>
      </div>

    </div>
  );
}
