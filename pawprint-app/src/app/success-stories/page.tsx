"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Trophy, ArrowLeft, Calendar, Heart, MapPin, Loader2, Sparkles, Home } from "lucide-react";
import { Logo } from "@/components/Logo";
import { GuestNavbar } from "@/components/GuestNavbar";

interface ReunitedPet {
  id: string;
  title: string;
  breed: string;
  location_name: string;
  image_url: string;
  event_time: string;
  reunited_time: string;
  reunited_message: string;
}

export default function SuccessStories() {
  const { width, height } = useWindowSize();
  const [stories, setStories] = useState<ReunitedPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Only show confetti on mount for a few seconds
  const [showConfetti, setShowConfetti] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchStories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pets/success`);
        if (!response.ok) throw new Error("Failed to load success stories");
        const data = await response.json();
        setStories(data);
      } catch (err: any) {
        console.error("Error:", err);
        setError("Could not load success stories right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();

    // Stop dropping new confetti after 6 seconds, let existing ones fall
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-pawprint-dark text-white font-sans overflow-x-hidden flex flex-col">
      <GuestNavbar />
      
      {/* Confetti Overlay */}
      {isMounted && showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti 
            width={width} 
            height={height} 
            recycle={false} 
            numberOfPieces={400} 
            gravity={0.15}
            colors={['#f59e0b', '#fbbf24', '#fcd34d', '#10b981', '#34d399', '#ffffff']}
          />
        </div>
      )}

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-6 shadow-lg shadow-yellow-500/20">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Success Stories
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Celebrating the joyous reunions made possible by our incredible community. Every pet back home is a victory worth celebrating! 🎉
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
            <p className="text-gray-400 font-medium">Loading happy endings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 text-center max-w-md mx-auto">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm">
              Try Again
            </button>
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-[#1e222a] border border-gray-800 rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <Heart className="w-16 h-16 text-gray-700 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-300 mb-2">No Success Stories Yet</h2>
            <p className="text-gray-500 text-sm">
              We're waiting for our first big reunion! Keep an eye on the map and help bring pets home.
            </p>
            <Link href="/explore" className="inline-flex mt-6 bg-pawprint-green hover:bg-[#059669] text-white font-bold px-6 py-3 rounded-lg transition-colors">
              Explore Live Alerts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div 
                key={story.id} 
                className="bg-[#1e222a] border border-gray-800 rounded-2xl overflow-hidden hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 group flex flex-col"
              >
                {/* Image Section */}
                <div className="h-56 relative overflow-hidden bg-black/50 shrink-0">
                  <div className="absolute top-3 right-3 z-10 bg-yellow-500 text-yellow-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Reunited
                  </div>
                  
                  {story.image_url ? (
                    <img 
                      src={story.image_url} 
                      alt={story.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <Trophy className="w-16 h-16 stroke-[1]" />
                    </div>
                  )}
                  
                  {/* Gradient Overlay for Text Visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e222a] via-[#1e222a]/20 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-xl font-bold text-white drop-shadow-md line-clamp-1">{story.title}</h2>
                    {story.breed && (
                      <p className="text-yellow-400 text-xs font-semibold drop-shadow-md truncate">{story.breed}</p>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start gap-3 mb-6">
                    <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300 leading-snug">Found near <span className="font-semibold text-white">{story.location_name}</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-xl p-4 flex-1">
                    <p className="text-sm text-gray-200 italic leading-relaxed">
                      "{story.reunited_message || 'Safely reunited with their family!'}"
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Lost: {new Date(story.event_time).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400/80">
                      <Trophy className="w-3.5 h-3.5" />
                      Found: {new Date(story.reunited_time).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center bg-black/20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Logo className="w-5 h-5 text-gray-600" />
          <span className="text-gray-500 text-xs font-bold">PawPrint</span>
        </div>
        <p className="text-[10px] text-gray-600">Bringing pets home, one click at a time.</p>
      </footer>
    </div>
  );
}
