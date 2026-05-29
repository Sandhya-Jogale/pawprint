import { ActivitySidebar } from "@/components/ActivitySidebar";
import { InteractiveMap } from "@/components/InteractiveMap";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <>
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map Area */}
        <div className="flex-1 bg-gray-100 relative">
          <InteractiveMap />
        </div>
        
        {/* Floating Action Buttons */}
        <div className="absolute bottom-10 right-10 flex gap-4 z-10">
           <Link href="/report" className="bg-pawprint-green text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-pawprint-green/30 hover:bg-[#059669] hover:scale-105 transition-all flex items-center gap-2">
              <span className="text-xl leading-none">+</span> Report Sighting
           </Link>
           <Link href="/report-lost" className="bg-red-500 text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-red-500/30 hover:bg-red-600 hover:scale-105 transition-all flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Report Lost Pet
           </Link>
        </div>
      </div>

      <ActivitySidebar />
    </>
  );
}
