"use client";

import Link from "next/link";
import { 
  ArrowLeft, Upload, AlertCircle, MapPin, Crosshair, 
  User, Phone, Mail, Calendar, Clock 
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { CldUploadWidget } from 'next-cloudinary';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LocationPicker } from "@/components/LocationPicker";

export default function ReportLost() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [forceLocation, setForceLocation] = useState<{lat: number, lng: number} | undefined>(undefined);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    petType: "",
    breed: "",
    age: "",
    primaryColor: "",
    size: "",
    gender: "",
    features: "",
    event_date: "",
    event_time: "",
    location_name: "",
    reward: "",
    additional_notes: "",
    phone: "",
    latitude: 0,
    longitude: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setForceLocation({ lat, lng });
      
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        const address = data.display_name || "Unknown Location";
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng, location_name: address }));
      } catch (error) {
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng, location_name: "Selected Location" }));
      }
    }, () => {
      alert("Unable to retrieve your location. Please check browser permissions.");
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) {
      alert("You must be logged in to submit a report.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pets/lost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          email: session.user.email,
          image_url: imageUrl,
          latitude: formData.latitude || 40.7418,
          longitude: formData.longitude || -73.9083
        }),
      });

      if (response.ok) {
        router.push("/report-success?type=lost");
      } else {
        const err = await response.json();
        alert(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full pb-24 font-sans text-gray-900">
      
      {/* Header */}
      <div className="w-full bg-white px-6 py-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-50">
        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <Logo className="w-8 h-8" iconClassName="w-5 h-5" />
        <div>
          <h1 className="text-sm font-bold text-gray-900">Report Lost Pet</h1>
          <p className="text-[10px] text-gray-500">Help us bring your pet home safely</p>
        </div>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto pt-6 px-4 space-y-6">
        
        {/* Alert Banner */}
        <div className="bg-[#fffbeb] border border-[#fde047] rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[#b45309] text-xs font-bold mb-0.5">Time is critical</h3>
            <p className="text-[#d97706] text-[10px]">The sooner you report, the better the chances of finding your pet. Our community will be notified immediately.</p>
          </div>
        </div>

        {/* Pet Photo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xs font-bold text-gray-900 mb-4">Pet Photo</h2>
          
          <CldUploadWidget 
            uploadPreset="pawprint_uploads"
            onSuccess={(result: any) => {
              if (result.info && result.info.secure_url) {
                setImageUrl(result.info.secure_url);
              }
            }}
          >
            {({ open }) => {
              return (
                <div 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    try {
                      if (open) open();
                    } catch (err) {
                      console.warn("Upload widget not ready yet");
                    }
                  }}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden"
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="Uploaded pet" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400 mb-3" />
                      <p className="text-[11px] font-bold text-gray-700 mb-1">Click to Upload Photo</p>
                      <p className="text-[9px] text-gray-500">Supports JPG, PNG, WebP</p>
                    </>
                  )}
                </div>
              );
            }}
          </CldUploadWidget>
        </div>

        {/* Pet Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xs font-bold text-gray-900 mb-4">Pet Information</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1">Pet Name *</label>
              <input required name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g., Max" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1">Pet Type *</label>
              <input required name="petType" value={formData.petType} onChange={handleChange} type="text" placeholder="e.g., Dog, Cat" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1">Breed</label>
              <input name="breed" value={formData.breed} onChange={handleChange} type="text" placeholder="e.g., Golden Retriever" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1">Age</label>
              <input name="age" value={formData.age} onChange={handleChange} type="text" placeholder="e.g., 3 years" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1">Primary Color *</label>
              <input required name="primaryColor" value={formData.primaryColor} onChange={handleChange} type="text" placeholder="e.g., Brown, White & Black" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1">Size *</label>
              <input required name="size" value={formData.size} onChange={handleChange} type="text" placeholder="e.g., Medium (20-40 lbs)" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1">Gender *</label>
              <select 
                required 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange} 
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none text-gray-600 appearance-none"
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Not Sure">Not Sure</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-700 mb-1">Distinguishing Features</label>
            <textarea 
              name="features" value={formData.features} onChange={handleChange}
              rows={3}
              placeholder="e.g., White spot on chest, collar with tag, microchipped, scar on left ear..."
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none resize-none"
            ></textarea>
          </div>
        </div>

        {/* Last Seen Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xs font-bold text-gray-900 mb-4 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-pawprint-green" /> Last Seen Information
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700 mb-1">
                <Calendar className="w-3 h-3 text-gray-400" /> Date Last Seen *
              </label>
              <input required name="event_date" value={formData.event_date} onChange={handleChange} type="date" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none text-gray-500" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700 mb-1">
                <Clock className="w-3 h-3 text-gray-400" /> Time Last Seen
              </label>
              <input name="event_time" value={formData.event_time} onChange={handleChange} type="time" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none text-gray-500" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-bold text-gray-700 mb-1">Location Last Seen *</label>
            <input required name="location_name" value={formData.location_name} onChange={handleChange} type="text" placeholder="e.g., 123 Main St, City, State or General Area" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none mb-3" />
            
            {/* Interactive Map Picker */}
            <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-200 relative overflow-hidden flex items-center justify-center mb-2 z-0">
              <LocationPicker 
                forceLocation={forceLocation}
                onChange={(lat, lng, address) => {
                  setFormData(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                    location_name: address
                  }));
                }} 
              />
            </div>
            
            <button type="button" onClick={handleCurrentLocation} className="mt-2 text-pawprint-green text-[10px] font-bold flex items-center gap-1.5 hover:underline">
              <Crosshair className="w-3.5 h-3.5" /> Use my current location
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xs font-bold text-gray-900 mb-4">Your Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700 mb-1">
                <User className="w-3 h-3 text-gray-400" /> Your Name *
              </label>
              <input type="text" disabled value={session?.user?.name || "Loading..."} className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2.5 text-[11px] outline-none text-gray-500 cursor-not-allowed" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700 mb-1">
                  <Phone className="w-3 h-3 text-gray-400" /> Phone Number *
                </label>
                <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="(555) 123-4567" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none" />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700 mb-1">
                  <Mail className="w-3 h-3 text-gray-400" /> Email Address *
                </label>
                <input type="email" disabled value={session?.user?.email || "Loading..."} className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2.5 text-[11px] outline-none text-gray-500 cursor-not-allowed" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xs font-bold text-gray-900 mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1">Reward (Optional)</label>
              <input name="reward" value={formData.reward} onChange={handleChange} type="text" placeholder="e.g., $500 reward for safe return" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1">Additional Notes</label>
              <textarea 
                name="additional_notes" value={formData.additional_notes} onChange={handleChange}
                rows={3}
                placeholder="Any other information that might help find your pet..."
                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <Link href="/dashboard" className="w-1/3 bg-[#e5e7eb] text-gray-600 font-bold py-3.5 rounded-lg text-xs text-center hover:bg-gray-300 transition-colors">
             Cancel
          </Link>
          <button type="submit" disabled={isSubmitting} className="w-2/3 bg-pawprint-green text-white font-bold py-3.5 rounded-lg text-xs hover:bg-[#059669] transition-colors shadow-lg shadow-pawprint-green/20 disabled:opacity-50 flex items-center justify-center gap-2">
             {isSubmitting ? "Saving to Database..." : "Submit Lost Pet Report"}
          </button>
        </div>

      </form>
    </div>
  );
}
