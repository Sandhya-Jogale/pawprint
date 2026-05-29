"use client";

import { useState, useEffect } from "react";
import { 
  User, Mail, Phone, Bell, Shield, Camera, 
  ArrowRight, Save, LogOut, LogIn, MapPin, Loader2, Compass
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Settings() {
  const { data: session, status: sessionStatus } = useSession();
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [sightingAlerts, setSightingAlerts] = useState(true);
  
  // Coordinate states
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  // Loading & Alert states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  // Active email
  const userEmail = session?.user?.email || "jogalesandhya50@gmail.com";

  // Fetch settings from API
  const fetchSettings = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${userEmail}`);
      if (!response.ok) {
        throw new Error("Failed to fetch settings from server.");
      }
      const data = await response.json();
      
      setFullName(data.full_name || "");
      setPhoneNumber(data.phone_number || "");
      setEmailNotif(data.email_notifications !== undefined ? data.email_notifications : true);
      setPushNotif(data.push_notifications !== undefined ? data.push_notifications : true);
      setSightingAlerts(data.sighting_alerts !== undefined ? data.sighting_alerts : true);
      setLatitude(data.latitude !== null && data.latitude !== undefined ? data.latitude.toString() : "");
      setLongitude(data.longitude !== null && data.longitude !== undefined ? data.longitude.toString() : "");
    } catch (err: any) {
      console.error("Error loading settings:", err);
      setErrorMsg("Failed to connect to the backend server. Using defaults.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStatus !== "loading") {
      fetchSettings();
    }
  }, [userEmail, sessionStatus]);

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const latNum = latitude.trim() !== "" ? parseFloat(latitude) : null;
    const lonNum = longitude.trim() !== "" ? parseFloat(longitude) : null;

    // Basic coordinate range validation
    if (latNum !== null && (isNaN(latNum) || latNum < -90 || latNum > 90)) {
      setErrorMsg("Latitude must be a valid number between -90 and 90.");
      setSaving(false);
      return;
    }
    if (lonNum !== null && (isNaN(lonNum) || lonNum < -180 || lonNum > 180)) {
      setErrorMsg("Longitude must be a valid number between -180 and 180.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${userEmail}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          full_name: fullName,
          phone_number: phoneNumber,
          email_notifications: emailNotif,
          push_notifications: pushNotif,
          sighting_alerts: sightingAlerts,
          latitude: latNum,
          longitude: lonNum
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save settings.");
      }

      const updated = await response.json();
      setSuccessMsg("Settings saved successfully!");
      // Auto fade success message after 3 seconds
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error("Error saving settings:", err);
      setErrorMsg("Error saving settings to server. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Get current GPS location using Geolocation API
  const handleLocateMe = () => {
    setLocating(true);
    setErrorMsg(null);
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setLocating(false);
        setSuccessMsg("Coordinates updated to current location!");
        setTimeout(() => setSuccessMsg(null), 3000);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setErrorMsg(`Unable to retrieve location: ${error.message}`);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="flex-1 bg-gray-50 h-full overflow-y-auto font-sans">
      <div className="max-w-2xl mx-auto pt-12 pb-6 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-[11px] text-gray-500 font-medium">Manage your account preferences and alert coordinates</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-24 space-y-6">
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs font-semibold animate-fade-in">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-xs font-semibold animate-fade-in">
            {successMsg}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-pawprint-green animate-spin" />
            <p className="text-xs text-gray-500 mt-3 font-semibold">Loading settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Profile & Personal Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-pawprint-green rounded-full flex items-center justify-center shadow-inner">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <button type="button" className="absolute bottom-0 right-0 bg-white border border-gray-200 p-1 rounded-full shadow-sm hover:bg-gray-50">
                    <Camera className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{fullName || "User"}</h2>
                  <p className="text-[10px] text-gray-500">{userEmail}</p>
                </div>
              </div>

              <hr className="border-gray-100 mb-6" />

              <h3 className="text-xs font-bold text-gray-900 mb-4 flex items-center gap-1.5">
                <User className="w-4 h-4 text-pawprint-green" /> Personal Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-gray-600 mb-1 font-bold">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] font-semibold text-gray-800 focus:ring-1 focus:ring-pawprint-green outline-none" 
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-[10px] text-gray-600 mb-1 font-bold">
                    <Mail className="w-3 h-3" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    value={userEmail} 
                    disabled 
                    className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2.5 text-[11px] font-semibold text-gray-500 cursor-not-allowed outline-none" 
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-[10px] text-gray-600 mb-1 font-bold">
                    <Phone className="w-3 h-3" /> Phone Number
                  </label>
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] font-semibold text-gray-800 focus:ring-1 focus:ring-pawprint-green outline-none" 
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Geofence / Alert Zone Settings Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-pawprint-green" /> Alert Zone (Geofence alert coordinates)
              </h3>
              <p className="text-[10px] text-gray-400 font-medium mb-6">
                Define your home coordinates. We'll alert you immediately when pets go missing or are sighted within a 5-kilometer (approx. 3-mile) radius of this area.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-600 mb-1 font-bold">Latitude</label>
                  <input 
                    type="number" 
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] font-semibold text-gray-800 focus:ring-1 focus:ring-pawprint-green outline-none" 
                    placeholder="e.g. 13.0580"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-600 mb-1 font-bold">Longitude</label>
                  <input 
                    type="number" 
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] font-semibold text-gray-800 focus:ring-1 focus:ring-pawprint-green outline-none" 
                    placeholder="e.g. 77.6422"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button 
                  type="button" 
                  onClick={handleLocateMe}
                  disabled={locating}
                  className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 font-bold text-[10px] px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {locating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 text-pawprint-green animate-spin" />
                      Locating...
                    </>
                  ) : (
                    <>
                      <Compass className="w-3.5 h-3.5 text-pawprint-green" />
                      Locate Me (Current GPS)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Notification Preferences Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-gray-900 mb-6 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-pawprint-green" /> Notification Preferences
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-gray-900">Email Notifications</p>
                    <p className="text-[9px] text-gray-500">Receive updates and alerts via email</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setEmailNotif(!emailNotif)}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${emailNotif ? 'bg-pawprint-green' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${emailNotif ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-gray-900">Push Notifications</p>
                    <p className="text-[9px] text-gray-500">Receive push notifications on your device</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setPushNotif(!pushNotif)}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${pushNotif ? 'bg-pawprint-green' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${pushNotif ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-gray-900">Sighting Alerts</p>
                    <p className="text-[9px] text-gray-500">Get notified when animals are sighted near you</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSightingAlerts(!sightingAlerts)}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${sightingAlerts ? 'bg-pawprint-green' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${sightingAlerts ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy & Security Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-gray-900 mb-4 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-pawprint-green" /> Privacy & Security
              </h3>

              <div className="space-y-2">
                <button type="button" className="w-full flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors group text-left">
                  <span className="text-[11px] font-bold text-gray-800">Change Password</span>
                  <ArrowRight className="w-3.5 h-3.5 text-pawprint-green group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button type="button" className="w-full flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors group text-left">
                  <span className="text-[11px] font-bold text-gray-800">Two-Factor Authentication</span>
                  <ArrowRight className="w-3.5 h-3.5 text-pawprint-green group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button type="button" className="w-full flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors group text-left">
                  <span className="text-[11px] font-bold text-gray-800">Privacy Settings</span>
                  <ArrowRight className="w-3.5 h-3.5 text-pawprint-green group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button 
              type="submit" 
              disabled={saving}
              className="w-full bg-pawprint-green text-white font-bold py-3.5 rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-[#059669] disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors shadow-lg shadow-pawprint-green/20"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </form>
        )}

        {/* Account Actions */}
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-6 mt-8">
          <h3 className="text-xs font-bold text-[#b91c1c] mb-4 flex items-center gap-1.5">
            <LogIn className="w-4 h-4 rotate-180" /> Account Actions
          </h3>

          <div className="space-y-3">
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full bg-white border border-[#fecaca] rounded-lg p-4 flex items-center justify-between hover:bg-red-50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <LogOut className="w-4 h-4 text-red-500 mt-0.5" />
                <div className="text-left">
                  <p className="text-[11px] font-bold text-gray-900">Logout</p>
                  <p className="text-[9px] text-red-600">Sign out of your account</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button className="w-full bg-white border border-[#fecaca] rounded-lg p-4 flex items-center justify-between hover:bg-red-50 transition-colors group">
              <div className="text-left pl-7">
                <p className="text-[11px] font-bold text-gray-900">Delete Account</p>
                <p className="text-[9px] text-red-600">Permanently delete your account and data</p>
              </div>
              <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
