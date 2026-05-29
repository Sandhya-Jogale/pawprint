"use client";

import Link from "next/link";
import { AlertCircle, Trophy, Plus, MapPin, Clock, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface ActivitySidebarProps {
  showGuestReportButton?: boolean;
}

// Helper function to calculate time ago
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return Math.floor(seconds) + " secs ago";
}

export function ActivitySidebar({ showGuestReportButton = false }: ActivitySidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'alerts' | 'success'>('alerts');
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [successStories, setSuccessStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlerts = activeAlerts.filter(alert => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (alert.title && alert.title.toLowerCase().includes(query)) ||
      (alert.breed && alert.breed.toLowerCase().includes(query)) ||
      (alert.location_name && alert.location_name.toLowerCase().includes(query)) ||
      (alert.description && alert.description.toLowerCase().includes(query))
    );
  });

  useEffect(() => {
    // Fetch live data from backend
    const fetchData = async () => {
      setLoading(true);
      try {
        const [alertsRes, successRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pets/active`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pets/success`)
        ]);

        if (alertsRes.ok) setActiveAlerts(await alertsRes.json());
        if (successRes.ok) setSuccessStories(await successRes.json());
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-[340px] bg-white h-full border-l border-gray-100 flex flex-col shrink-0">
      {/* Optional Guest Report Button */}
      {showGuestReportButton && (
        <div className="p-4 pb-0">
          <Link href="/report" className="w-full bg-pawprint-green text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#059669] transition-colors">
            <Plus className="w-4 h-4" />
            Report Sighting
          </Link>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mt-2">
        <button 
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-[11px] transition-colors ${
            activeTab === 'alerts' 
              ? 'border-b-2 border-pawprint-green text-pawprint-green' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          Active Alerts
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ml-1 ${activeTab === 'alerts' ? 'bg-[#d1fae5] text-pawprint-green' : 'bg-gray-100 text-gray-600'}`}>
            {activeAlerts.length}
          </span>
        </button>
        <button 
          onClick={() => setActiveTab('success')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-[11px] transition-colors ${
            activeTab === 'success' 
              ? 'border-b-2 border-[#f59e0b] text-gray-900' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          Success Stories
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ml-1 ${activeTab === 'success' ? 'bg-[#fef3c7] text-[#d97706]' : 'bg-gray-100 text-gray-600'}`}>
            {successStories.length}
          </span>
        </button>
      </div>

      {/* Conditional Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-gray-50/50">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-pawprint-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'alerts' ? (
          <>
            {/* Filters */}
            <div className="p-4 border-b border-gray-100 shrink-0 bg-white">
              <h3 className="text-xs font-bold text-gray-800 mb-3">Recent Activity</h3>
              
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search pets, breeds, locations..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-pawprint-green"
                />
              </div>

              <div className="flex gap-2">
                <button className="bg-[#d1fae5] text-pawprint-green text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-pawprint-green rounded-full block"></span>
                  Sighted ({activeAlerts.filter(a => a.alert_type === 'SIGHTING').length})
                </button>
                <button className="bg-[#fef3c7] text-[#d97706] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#f59e0b] rounded-full block"></span>
                  Lost ({activeAlerts.filter(a => a.alert_type === 'LOST').length})
                </button>
              </div>
            </div>

            {/* Activity List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-xs">No active alerts found.</div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    onClick={() => router.push(`${pathname}?alertId=${alert.id}`)}
                    className="bg-white border border-gray-100 rounded-xl p-3 flex gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="relative w-16 h-16 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                      {alert.image_url ? (
                        <img src={alert.image_url} alt={alert.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full ${alert.alert_type === 'LOST' ? 'bg-[#e38c5d]' : 'bg-[#d6bc97]'}`}></div>
                      )}
                      {alert.alert_type === 'LOST' && (
                        <div className="absolute top-0 left-0 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-br-lg flex items-center gap-0.5">
                            <AlertCircle className="w-2 h-2" /> Lost
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{alert.title}</h4>
                        {alert.alert_type === 'SIGHTING' && (
                          <span className="bg-[#d1fae5] text-pawprint-green text-[8px] font-bold px-1.5 py-0.5 rounded">Sighted</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 truncate mb-1">{alert.breed} • {alert.location_name}</p>
                      <p className="text-[9px] text-gray-400">{timeAgo(alert.event_time)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {/* Success Header block */}
            <div className="bg-[#fffbeb] p-4 border-b border-[#fde047] shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[#92400e] text-[11px] font-bold flex items-center gap-1.5 mb-1">
                    <Trophy className="w-3.5 h-3.5" /> Community Wins
                  </h3>
                  <p className="text-[10px] text-[#b45309]">Celebrating {successStories.length} successful reunions 🎉</p>
                </div>
                <Link href="/success-stories" className="bg-[#fde047] hover:bg-[#facc15] text-[#92400e] font-bold text-[9px] px-2 py-1.5 rounded transition-colors shadow-sm whitespace-nowrap">
                  View Wall
                </Link>
              </div>
            </div>

            {/* Success List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {successStories.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-xs">No success stories yet.</div>
              ) : (
                successStories.map((story) => (
                  <div 
                    key={story.id} 
                    onClick={() => router.push(`${pathname}?alertId=${story.id}`)}
                    className="bg-white border-2 border-[#fde047] rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="p-3 flex gap-3">
                      <div className="w-16 h-16 bg-[#c99a4e] rounded-lg shrink-0 overflow-hidden">
                        {story.image_url ? (
                          <img src={story.image_url} alt={story.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#d6bc97]"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{story.title}</h4>
                          <span className="bg-[#fde047] text-[#92400e] text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            REUNITED <span className="text-[10px]">✨</span>
                          </span>
                        </div>
                        <p className="text-[9px] text-gray-500 mb-0.5">{story.breed}</p>
                        <p className="text-[9px] text-gray-400 flex items-center gap-1 mt-1.5">
                          <MapPin className="w-2.5 h-2.5 text-gray-300" /> {story.location_name}
                        </p>
                        <p className="text-[8px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5 text-gray-300" /> {timeAgo(story.reunited_time || story.event_time)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#fffbeb] px-3 py-2 border-t border-[#fde047]/30 text-[9px] text-[#92400e] font-medium">
                      🎉 {story.reunited_message || `${story.title} found safe and sound!`}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer Text */}
      <div className="p-3 bg-white border-t border-gray-100 text-center shrink-0">
        <p className="text-[9px] font-medium text-pawprint-green">
          💚 Together, we bring pets home safely
        </p>
      </div>
    </div>
  );
}
