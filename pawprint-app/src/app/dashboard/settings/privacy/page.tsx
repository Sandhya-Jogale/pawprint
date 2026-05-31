"use client";

import { useState } from "react";
import { ArrowLeft, Shield, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PrivacySettings() {
  const router = useRouter();

  const [shareData, setShareData] = useState(false);
  const [publicProfile, setPublicProfile] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);

    // Simulate API call to save privacy settings
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Privacy settings saved successfully!");
      
      // Auto fade success message after 3 seconds
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 1000);
  };

  return (
    <div className="flex-1 bg-gray-50 h-full overflow-y-auto font-sans">
      <div className="max-w-2xl mx-auto pt-12 pb-6 px-4">
        <Link href="/dashboard/settings" className="inline-flex items-center text-[11px] text-gray-500 hover:text-pawprint-green font-bold mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Settings
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Shield className="w-6 h-6 text-pawprint-green" /> Privacy Settings
        </h1>
        <p className="text-[11px] text-gray-500 font-medium">Control how your data is shared and who can see your profile.</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-24 space-y-6">
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-xs font-semibold animate-fade-in flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-900">Public Profile</p>
                <p className="text-[9px] text-gray-500">Allow other users to see your name and contact info on alerts.</p>
              </div>
              <button 
                type="button"
                onClick={() => setPublicProfile(!publicProfile)}
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${publicProfile ? 'bg-pawprint-green' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${publicProfile ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-900">Show Exact Location</p>
                <p className="text-[9px] text-gray-500">Display your exact alert zone coordinates to the community.</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowLocation(!showLocation)}
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${showLocation ? 'bg-pawprint-green' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${showLocation ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-900">Share Data with Partners</p>
                <p className="text-[9px] text-gray-500">Share anonymized data with local shelters and animal control.</p>
              </div>
              <button 
                type="button"
                onClick={() => setShareData(!shareData)}
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${shareData ? 'bg-pawprint-green' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${shareData ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-pawprint-green text-white font-bold py-3.5 rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-[#059669] disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors shadow-lg shadow-pawprint-green/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Privacy Settings...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
