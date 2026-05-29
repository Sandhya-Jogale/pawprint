"use client";

import dynamic from 'next/dynamic';

const LocationPickerLogic = dynamic(() => import('./LocationPickerLogic'), { 
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

interface LocationPickerProps {
  onChange?: (lat: number, lng: number, address: string) => void;
  forceLocation?: { lat: number; lng: number };
  defaultLocation?: { lat: number; lng: number };
  readOnly?: boolean;
}

export function LocationPicker({ onChange, forceLocation, defaultLocation, readOnly }: LocationPickerProps) {
  return (
    <div className="relative w-full h-full">
      <LocationPickerLogic 
        onChange={onChange} 
        forceLocation={forceLocation} 
        defaultLocation={defaultLocation}
        readOnly={readOnly}
      />
    </div>
  );
}
