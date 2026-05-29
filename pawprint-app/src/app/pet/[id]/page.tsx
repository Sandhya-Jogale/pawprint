"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Clock, AlertCircle, Share2, Info, Sparkles, MessageSquare, Send } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LocationPicker } from "@/components/LocationPicker";
import { useSession } from "next-auth/react";

export default function PetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pets/${id}`);
        if (!res.ok) throw new Error("Failed to load pet details");
        const data = await res.json();
        setPet(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pets/${id}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    
    fetchPet();
    fetchMessages();
  }, [id]);

  useEffect(() => {
    if (session?.user?.email) {
      setUserEmail(session.user.email);
    } else {
      setUserEmail(null);
    }
  }, [session]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userEmail) return;
    
    setSendingMsg(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pets/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, message: newMessage })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages([...messages, data]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-pawprint-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm mt-4 font-bold">Loading details...</p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Pet Not Found</h1>
        <p className="text-gray-500 text-sm mb-6">{error || "This alert may have been removed."}</p>
        <Link href="/dashboard" className="bg-pawprint-green text-white px-6 py-2 rounded-lg font-bold">Back to Dashboard</Link>
      </div>
    );
  }

  const isLost = pet.alert_type === 'LOST';
  const isReunited = pet.status === 'REUNITED';

  // Helper to parse the concatenated description string into a beautiful vertical list
  const renderDescription = (desc: string) => {
    if (!desc) return <p className="text-sm text-gray-700">No additional details provided.</p>;
    
    // Check if it follows our "Key: Value. Key: Value." pattern
    if (desc.includes(':') && desc.includes('.')) {
      const parts = desc.split('. ').filter(part => part.trim() !== '');
      
      const items = parts.map((part, idx) => {
        const [key, ...valueParts] = part.split(': ');
        const value = valueParts.join(': ').trim();
        
        // Skip empty or undefined values
        if (!value || value === 'undefined' || value === '.' || value === 'null') return null;
        
        // Clean trailing periods
        const cleanValue = value.replace(/\.$/, '');

        return (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-2 border-b border-gray-200/60 last:border-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 w-28 shrink-0">{key}</span>
            <span className="text-sm font-medium text-gray-900">{cleanValue}</span>
          </div>
        );
      });

      // If all items were null, just return the text
      if (items.every(i => i === null)) {
         return <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{desc}</p>;
      }

      return <div className="space-y-1">{items}</div>;
    }
    
    // Fallback for regular text
    return <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{desc}</p>;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Header */}
      <div className="w-full bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard?alertId=${pet.id}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <Logo className="w-8 h-8" iconClassName="w-5 h-5" />
          <div>
            <h1 className="text-sm font-bold text-gray-900">{isLost ? 'Lost Pet Alert' : 'Pet Sighting'}</h1>
            <p className="text-[10px] text-gray-500">ID: #{pet.id}</p>
          </div>
        </div>
        <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6">
        
        {/* Left Column: Image & Status */}
        <div className="w-full md:w-5/12 space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="relative w-full aspect-square bg-gray-100">
              {pet.image_url ? (
                <img src={pet.image_url} alt={pet.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                  <Info className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs font-medium">No photo available</p>
                </div>
              )}
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                  isReunited ? 'bg-[#fef3c7] text-[#d97706]' :
                  isLost ? 'bg-red-500 text-white' : 'bg-pawprint-green text-white'
                }`}>
                  {isReunited ? 'REUNITED ✨' : isLost ? 'LOST PET' : 'SIGHTING'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Contact Information</h3>
            <p className="text-xs text-gray-600 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-800">
               If you have information about this pet, please reach out immediately.
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Reporter Name</p>
                <p className="text-sm font-medium text-gray-900">{pet.reporter_name || 'Anonymous User'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Map */}
        <div className="w-full md:w-7/12 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{pet.title}</h2>
            <p className="text-sm text-gray-500 mb-6 font-medium">{pet.breed}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 mb-6">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3 h-3" /> Date
                </p>
                <p className="text-xs font-medium text-gray-900">{new Date(pet.event_time).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide flex items-center gap-1.5 mb-1">
                  <Clock className="w-3 h-3" /> Time
                </p>
                <p className="text-xs font-medium text-gray-900">{new Date(pet.event_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
              <div className="col-span-2 sm:col-span-3 pt-2 border-t border-gray-100">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3 h-3" /> Location
                </p>
                <p className="text-sm font-medium text-gray-900">{pet.location_name}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6 shadow-inner">
              <h3 className="text-xs font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">Characteristics & Details</h3>
              {renderDescription(pet.description)}
            </div>
            
            {/* Displaying map for location context */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                 <MapPin className="w-4 h-4 text-pawprint-green" /> Location Pin
              </h3>
              <div className="w-full h-56 rounded-xl overflow-hidden border border-gray-200 relative z-0">
                 <LocationPicker 
                   readOnly={true} 
                   defaultLocation={{ lat: pet.latitude, lng: pet.longitude }} 
                 />
              </div>
            </div>

            {/* Smart Matches Section */}
            {pet.potentialMatches && pet.potentialMatches.length > 0 && (
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#d97706]" /> Potential Matches Found
                </h3>
                <p className="text-[10px] text-gray-500 mb-4">We found active {isLost ? 'sightings' : 'lost pet reports'} within 10km of this location.</p>
                <div className="space-y-3">
                  {pet.potentialMatches.map((match: any) => (
                    <Link key={match.id} href={`/pet/${match.id}`} className="bg-white border-2 border-transparent hover:border-[#fde047] rounded-xl p-3 flex gap-3 shadow-sm hover:shadow-md transition-all group cursor-pointer block">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                        {match.image_url ? (
                          <img src={match.image_url} alt={match.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Info className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#b45309] transition-colors">{match.title}</h4>
                          <span className="text-[9px] font-bold text-[#b45309] bg-[#fef3c7] px-1.5 py-0.5 rounded">
                            {match.distance.toFixed(1)} km away
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate mb-1 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-gray-300" /> {match.location_name}
                        </p>
                        <p className="text-[9px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-gray-300" /> {new Date(match.event_time).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Chat & Updates Section */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-pawprint-green" /> Chat & Updates
              </h3>
              
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 max-h-80 overflow-y-auto bg-gray-50/50 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-xs">No updates yet. Be the first to leave a message!</p>
                    </div>
                  ) : (
                    messages.map((msg: any) => (
                      <div key={msg.id} className="flex flex-col">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-900">{msg.sender_name}</span>
                          <span className="text-[9px] text-gray-400">{new Date(msg.created_at).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="bg-white p-3 rounded-r-xl rounded-bl-xl border border-gray-100 text-sm text-gray-700 shadow-sm inline-block max-w-[90%]">
                          {msg.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {userEmail ? (
                  <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex gap-2">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message or update..." 
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pawprint-green/50"
                      disabled={sendingMsg}
                    />
                    <button 
                      type="submit" 
                      disabled={!newMessage.trim() || sendingMsg}
                      className="bg-pawprint-green text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center disabled:opacity-50 hover:bg-[#059669] transition-colors"
                    >
                      {sendingMsg ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
                    <p className="text-xs text-gray-500 mb-2">Please log in to participate in the discussion.</p>
                    <Link href="/login" className="text-pawprint-green text-xs font-bold hover:underline">Log In</Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
