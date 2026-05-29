import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import L from 'leaflet';

// Fix for default Leaflet icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons for different alert types
// Custom Icons for different alert types
const createCustomIcon = (color: string, type: 'LOST' | 'SIGHTING' | 'REUNITED') => {
  let innerIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/></svg>`;
  
  if (type === 'REUNITED') {
    innerIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
  } else if (type === 'LOST') {
    innerIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;
  }

  const html = `
    <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
      <!-- Pulsing radar ring -->
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: ${color}; border-radius: 50%; opacity: 0.5; animation: map-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
      
      <!-- The Map Pin Container -->
      <div style="position: relative; background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 10; color: white;">
        ${innerIcon}
      </div>
      
      <!-- The Pin Tail -->
      <div style="position: absolute; bottom: -2px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid white; z-index: 11;"></div>
      <div style="position: absolute; bottom: 0px; width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 6px solid ${color}; z-index: 12;"></div>
    </div>
  `;

  return new L.DivIcon({
    className: 'custom-leaflet-icon-wrapper',
    html: html,
    iconSize: [40, 40],
    iconAnchor: [20, 40], // Point the anchor exactly at the bottom tip
    popupAnchor: [0, -38]
  });
};

const lostIcon = createCustomIcon('#ef4444', 'LOST'); // Red
const sightingIcon = createCustomIcon('#10b981', 'SIGHTING'); // Green
const successIcon = createCustomIcon('#f59e0b', 'REUNITED'); // Gold

function MapController({ alerts, markerRefs }: { alerts: any[], markerRefs: React.MutableRefObject<{ [key: string]: L.Marker | null }> }) {
  const map = useMap();
  const searchParams = useSearchParams();
  const alertId = searchParams?.get('alertId');

  useEffect(() => {
    if (alertId && markerRefs.current[alertId]) {
      const marker = markerRefs.current[alertId];
      const alertData = alerts.find(a => a.id.toString() === alertId);
      if (marker && alertData) {
        map.flyTo([alertData.latitude, alertData.longitude], 16, { duration: 1 });
        setTimeout(() => {
          marker.openPopup();
        }, 200);
      }
    }
  }, [alertId, alerts, map, markerRefs]);

  return null;
}

export default function MapLogic() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});
  
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const [activeRes, successRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pets/active`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pets/success`)
        ]);
        
        const activeData = activeRes.ok ? await activeRes.json() : [];
        const successData = successRes.ok ? await successRes.json() : [];
        
        setAlerts([...activeData, ...successData]);
      } catch (error) {
        console.error("Failed to fetch map data:", error);
      }
    };
    
    fetchMapData();
  }, []);

  // Default Center: Center of India
  const defaultCenter: [number, number] = [20.5937, 78.9629];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0 relative">
      <MapContainer 
        center={defaultCenter} 
        zoom={5} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController alerts={alerts} markerRefs={markerRefs} />
        
        {alerts.map((alert) => {
          // Determine icon based on type and status
          let icon = sightingIcon;
          let label = "Sighting";
          
          if (alert.status === 'REUNITED') {
            icon = successIcon;
            label = "Reunited ✨";
          } else if (alert.alert_type === 'LOST') {
            icon = lostIcon;
            label = "Lost Pet";
          }
          
          return (
            <Marker 
              key={alert.id} 
              position={[alert.latitude, alert.longitude]} 
              icon={icon}
              ref={(r) => {
                markerRefs.current[alert.id.toString()] = r;
              }}
            >
              <Popup>
                <div className="text-center p-1 min-w-[160px] max-w-[220px]">
                  {alert.image_url && (
                    <div className="w-full h-28 mb-3 rounded-lg overflow-hidden shadow-sm relative">
                      <img 
                        src={alert.image_url} 
                        alt={alert.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight">{alert.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-2 ${
                    alert.status === 'REUNITED' ? 'bg-[#fffbeb] text-[#d97706]' :
                    alert.alert_type === 'LOST' ? 'bg-red-50 text-red-600' : 'bg-[#d1fae5] text-pawprint-green'
                  }`}>
                    {label}
                  </span>
                  {alert.breed && <p className="text-xs text-gray-700 font-medium mb-1">{alert.breed}</p>}
                  {alert.description && (
                    <p className="text-[10px] text-gray-500 mb-2 line-clamp-2 leading-snug">
                      "{alert.description}"
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 max-w-[200px] truncate flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {alert.location_name}
                  </p>
                  <div className="mt-2 pt-2 border-t border-gray-100 text-[9px] text-gray-400">
                     {new Date(alert.event_time).toLocaleDateString()} at {new Date(alert.event_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <Link 
                    href={`/pet/${alert.id}`}
                    className="block w-full bg-pawprint-green text-white text-center py-2 rounded-lg mt-3 text-[11px] font-bold shadow-sm hover:bg-[#059669] transition-colors"
                  >
                    View Full Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
