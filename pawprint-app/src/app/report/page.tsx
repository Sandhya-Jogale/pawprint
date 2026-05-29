"use client";

import Link from "next/link";
import { Upload, Sparkles, MapPin, Crosshair, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { CldUploadWidget } from 'next-cloudinary';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LocationPicker } from "@/components/LocationPicker";

export default function Report() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [forceLocation, setForceLocation] = useState<{lat: number, lng: number} | undefined>(undefined);

  const [condition, setCondition] = useState("Healthy");
  const [collar, setCollar] = useState("");
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("");
  
  const [formData, setFormData] = useState({
    animal_type: "",
    location_name: "",
    additional_notes: "",
    event_date: "",
    event_time: "",
    contact_name: "",
    contact_phone: "",
    latitude: 0,
    longitude: 0
  });
  
  const backLink = status === "authenticated" ? "/dashboard" : "/explore";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pets/sighting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          condition,
          collar,
          size,
          gender,
          image_url: imageUrl,
          email: session?.user?.email || null, // If logged in, send email. If guest, send null.
          contact_name: session?.user?.name || formData.contact_name, // Default to account name if logged in
          latitude: formData.latitude || 40.7128,
          longitude: formData.longitude || -74.0060
        }),
      });

      if (response.ok) {
        router.push("/report-success?type=sighting");
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
    <div className="min-h-screen bg-pawprint-dark w-full pb-16">
      <div className="w-full max-w-2xl mx-auto pt-8 px-4">
        {/* Back Button */}
        <Link href={backLink} className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {status === "authenticated" ? "Dashboard" : "Explore"}
        </Link>

        {/* Header */}
        <div className="flex flex-col items-center justify-center text-white mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Logo className="w-8 h-8" iconClassName="w-5 h-5" />
            <h1 className="text-xl font-bold">Report a Sighting</h1>
          </div>
          <p className="text-[10px] text-gray-400">Help us rescue animals by sharing what you've seen</p>
        </div>

        {/* Main Form Card */}
        <form className="bg-white rounded-2xl p-6 md:p-8 space-y-8 shadow-xl" onSubmit={handleSubmit}>
          
          {/* Photo Upload */}
          <div>
            <label className="block text-[11px] font-bold text-gray-900 mb-2">Photo Upload</label>
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
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden"
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="Uploaded pet" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mb-3" />
                        <p className="text-[11px] font-bold text-gray-700 mb-1">Click to Upload Photo</p>
                        <p className="text-[9px] text-gray-500">Supports JPG, PNG up to 10MB</p>
                      </>
                    )}
                  </div>
                );
              }}
            </CldUploadWidget>
          </div>

          {/* Animal Type */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-bold text-gray-900">What kind of animal did you see? *</label>
            </div>
            <input 
              required 
              name="animal_type" 
              value={formData.animal_type} 
              onChange={handleChange}
              type="text" 
              placeholder="e.g., Brown Dog, Siamese Cat" 
              className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none" 
            />
            <p className="text-[8px] text-gray-400 mt-1.5 italic flex items-center gap-1">
              <Sparkles className="w-2 h-2 text-pawprint-green" /> Our AI Photo Scanner will automatically fill this in the future!
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[11px] font-bold text-gray-900 mb-2">Location *</label>
            <input 
              required 
              name="location_name" 
              value={formData.location_name} 
              onChange={handleChange}
              type="text" 
              placeholder="e.g., 123 Main St or General Area" 
              className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none mb-3" 
            />
            <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-200 relative overflow-hidden flex items-center justify-center z-0">
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

          {/* Condition */}
          <div>
            <label className="block text-[11px] font-bold text-gray-900 mb-2">Condition</label>
            <div className="grid grid-cols-3 gap-3">
              {['Healthy', 'Injured', 'Unknown'].map((opt) => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => setCondition(opt)}
                  className={`py-2.5 rounded-lg text-[11px] font-bold transition-all border ${
                    condition === opt 
                      ? 'border-pawprint-green text-pawprint-green bg-emerald-50' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-[11px] font-bold text-gray-900 mb-2">Additional Notes (Optional)</label>
            <textarea 
              name="additional_notes" 
              value={formData.additional_notes} 
              onChange={handleChange}
              rows={3}
              placeholder="Add any additional information about the animal..."
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none resize-none"
            ></textarea>
          </div>

          {/* Date and Time */}
          <div>
            <div className="flex items-center gap-2 mb-2">
               <label className="text-[11px] font-bold text-gray-900">When did you see the animal? *</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] text-gray-500 mb-1">Date</label>
                <input required name="event_date" value={formData.event_date} onChange={handleChange} type="date" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none text-gray-600" />
              </div>
              <div>
                <label className="block text-[9px] text-gray-500 mb-1">Time</label>
                <input required name="event_time" value={formData.event_time} onChange={handleChange} type="time" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none text-gray-600" />
              </div>
            </div>
          </div>

          {/* Collar or Tags */}
          <div>
            <div className="flex items-center gap-2 mb-2">
               <label className="text-[11px] font-bold text-gray-900">Collar or Tags?</label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['Yes', 'No', 'Unknown'].map((opt) => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => setCollar(opt)}
                  className={`py-2 rounded-lg text-[11px] font-bold transition-all border ${
                    collar === opt 
                      ? 'border-pawprint-green text-pawprint-green bg-emerald-50' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Approximate Size */}
          <div>
            <div className="flex items-center gap-2 mb-2">
               <label className="text-[11px] font-bold text-gray-900">Approximate Size</label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['Small', 'Medium', 'Large', 'Unknown'].map((opt) => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => setSize(opt)}
                  className={`py-2 rounded-lg text-[10px] font-bold transition-all border ${
                    size === opt 
                      ? 'border-pawprint-green text-pawprint-green bg-emerald-50' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <div className="flex items-center gap-2 mb-2">
               <label className="text-[11px] font-bold text-gray-900">Gender (if visible)</label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['Male', 'Female', 'Not Sure'].map((opt) => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => setGender(opt)}
                  className={`py-2 rounded-lg text-[11px] font-bold transition-all border ${
                    gender === opt 
                      ? 'border-pawprint-green text-pawprint-green bg-emerald-50' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
               <label className="text-[11px] font-bold text-gray-900">Your Contact Info</label>
               <span className="bg-gray-100 text-gray-500 text-[8px] font-bold px-1.5 py-0.5 rounded border border-gray-200">Optional</span>
            </div>
            <p className="text-[8px] text-gray-400 mb-3">We'll only use this to contact you for additional details.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] text-gray-500 mb-1">Name</label>
                <input 
                  disabled={status === "authenticated"}
                  name="contact_name" 
                  value={status === "authenticated" && session?.user?.name ? session.user.name : formData.contact_name} 
                  onChange={handleChange}
                  type="text" 
                  placeholder="Your name" 
                  className={`w-full border border-gray-200 rounded-lg p-2.5 text-[11px] outline-none ${status === "authenticated" ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50 focus:ring-1 focus:ring-pawprint-green'}`} 
                />
              </div>
              <div>
                <label className="block text-[9px] text-gray-500 mb-1">Phone Number</label>
                <input 
                  name="contact_phone" 
                  value={formData.contact_phone} 
                  onChange={handleChange}
                  type="tel" 
                  placeholder="(555) 456-7890" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none" 
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button type="submit" disabled={isSubmitting} className="w-full bg-pawprint-green text-white font-bold py-3.5 rounded-lg text-xs hover:bg-[#059669] transition-colors disabled:opacity-50 flex items-center justify-center">
               {isSubmitting ? "Submitting Sighting..." : "Submit Report"}
            </button>
          </div>
          
        </form>

        <p className="text-center text-[8px] text-gray-500 mt-6 pb-8">
          By submitting, you agree to our terms and help us make a difference.
        </p>
      </div>
    </div>
  );
}
