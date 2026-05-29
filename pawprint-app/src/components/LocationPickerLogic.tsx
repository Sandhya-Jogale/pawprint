import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerLogicProps {
  onChange?: (lat: number, lng: number, address: string) => void;
  defaultLocation?: { lat: number; lng: number };
  forceLocation?: { lat: number; lng: number };
  readOnly?: boolean;
}

// Component to handle clicks on the map
function MapClickHandler({ setPosition, onChange, readOnly }: { setPosition: any, onChange?: any, readOnly?: boolean }) {
  useMapEvents({
    async click(e) {
      if (readOnly) return;
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        // Nominatim returns a detailed display_name. We can use it directly.
        const address = data.display_name || "Unknown Location";
        if (onChange) onChange(lat, lng, address);
      } catch (error) {
        console.error("Geocoding failed", error);
        if (onChange) onChange(lat, lng, "Selected Location");
      }
    },
  });
  return null;
}

// Component to update map center programmatically
function MapUpdater({ forceLocation, setPosition }: { forceLocation?: {lat: number, lng: number}, setPosition: any }) {
  const map = useMap();
  useEffect(() => {
    if (forceLocation) {
      setPosition(forceLocation);
      map.flyTo([forceLocation.lat, forceLocation.lng], 15);
    }
  }, [forceLocation, map, setPosition]);
  return null;
}

export default function LocationPickerLogic({ onChange, defaultLocation, forceLocation, readOnly }: LocationPickerLogicProps) {
  // Default Center: Center of India
  const center: [number, number] = defaultLocation ? [defaultLocation.lat, defaultLocation.lng] : [20.5937, 78.9629];
  const [position, setPosition] = useState<{lat: number, lng: number} | null>(defaultLocation || null);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0 relative">
      <MapContainer 
        center={center} 
        zoom={position ? 15 : 5} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler setPosition={setPosition} onChange={onChange} readOnly={readOnly} />
        <MapUpdater forceLocation={forceLocation} setPosition={setPosition} />
        {position && <Marker position={position} />}
      </MapContainer>
      {!readOnly && (
        <div className="absolute top-2 right-2 z-[400] bg-white px-2 py-1 rounded text-[10px] font-bold text-gray-700 shadow-sm pointer-events-none">
          Click to drop pin
        </div>
      )}
    </div>
  );
}
