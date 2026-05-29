import { GuestNavbar } from "@/components/GuestNavbar";
import { ActivitySidebar } from "@/components/ActivitySidebar";
import { InteractiveMap } from "@/components/InteractiveMap";

export default function Explore() {
  return (
    <div className="flex flex-col h-screen bg-pawprint-dark w-full overflow-hidden font-sans">
      <GuestNavbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 bg-gray-100 relative">
          <InteractiveMap />
        </div>
        <ActivitySidebar showGuestReportButton={true} />
      </div>
    </div>
  );
}
