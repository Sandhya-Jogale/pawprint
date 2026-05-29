"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Eye, Trophy, AlertCircle, Trash2, CheckCircle, 
  Calendar, MapPin, Loader2, Plus, Sparkles, MessageSquare
} from "lucide-react";
import Link from "next/link";

interface PetReport {
  id: string;
  user_id: string;
  alert_type: 'LOST' | 'SIGHTING';
  status: 'ACTIVE' | 'REUNITED';
  title: string;
  breed?: string;
  description?: string;
  location_name: string;
  latitude: number;
  longitude: number;
  event_time: string;
  image_url?: string;
  reunited_time?: string;
  reunited_message?: string;
  created_at: string;
}

export default function MyReports() {
  const { data: session, status: sessionStatus } = useSession();
  const [reports, setReports] = useState<PetReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [reunitedModalOpen, setReunitedModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetReport | null>(null);
  const [reunitedMessage, setReunitedMessage] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  // Delete states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<PetReport | null>(null);

  // Fallback to john.doe@example.com for testing if not signed in
  const userEmail = session?.user?.email || "john.doe@example.com";

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pets/user/${userEmail}`);
      if (!response.ok) {
        if (response.status === 404) {
          // If user is not in database yet, show empty reports instead of error
          setReports([]);
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch reports");
      }
      const data = await response.json();
      setReports(data);
    } catch (err: any) {
      console.error("Error fetching reports:", err);
      setError(err.message || "Failed to connect to the backend server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStatus !== "loading") {
      fetchReports();
    }
  }, [userEmail, sessionStatus]);

  const handleMarkReunited = async () => {
    if (!selectedPet) return;
    setModalLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pets/${selectedPet.id}/reunited`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: reunitedMessage })
      });

      if (!response.ok) {
        throw new Error("Failed to mark as reunited");
      }

      // Update local state instantly
      const updatedPet = await response.json();
      setReports(reports.map(r => r.id === selectedPet.id ? updatedPet : r));
      setReunitedModalOpen(false);
      setSelectedPet(null);
      setReunitedMessage("");
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteReport = async () => {
    if (!petToDelete) return;
    setModalLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pets/${petToDelete.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete report");
      }

      // Filter out deleted pet
      setReports(reports.filter(r => r.id !== petToDelete.id));
      setDeleteConfirmOpen(false);
      setPetToDelete(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete report");
    } finally {
      setModalLoading(false);
    }
  };

  // Stats calculations
  const activeLost = reports.filter(r => r.status === 'ACTIVE' && r.alert_type === 'LOST').length;
  const activeSightings = reports.filter(r => r.status === 'ACTIVE' && r.alert_type === 'SIGHTING').length;
  const reunitedCount = reports.filter(r => r.status === 'REUNITED').length;

  return (
    <div className="flex-1 bg-gray-50 h-full overflow-y-auto font-sans relative">
      {/* Header Panel */}
      <div className="bg-white border-b border-gray-100 py-8 px-8 shrink-0">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-6 h-6 text-pawprint-green" /> My Listings & Reports
            </h1>
            <p className="text-[11px] text-gray-500 mt-1">
              Manage your submitted active alerts, sightings, and resolved reunion logs.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/report" className="bg-pawprint-green hover:bg-[#059669] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm">
              <Plus className="w-3.5 h-3.5" /> Sighting Report
            </Link>
            <Link href="/report-lost" className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm">
              <AlertCircle className="w-3.5 h-3.5" /> Lost Pet Alert
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-5xl mx-auto px-8 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-red-50 rounded-lg text-red-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Active Lost Alerts</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{activeLost}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-500">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Active Sightings</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{activeSightings}</p>
          </div>
        </div>

        <Link href="/success-stories" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow group relative overflow-hidden cursor-pointer block">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Pets Reunited 🎉</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{reunitedCount}</p>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded-md">View Wall</span>
          </div>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto px-8 py-8 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-pawprint-green animate-spin" />
            <p className="text-xs text-gray-500 mt-4 font-medium">Fetching your listings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-2xl text-center max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h3 className="font-bold text-sm">Connection Failed</h3>
            <p className="text-xs text-red-600 mt-1 leading-relaxed">{error}</p>
            <button onClick={fetchReports} className="mt-4 bg-red-600 text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
              Try Again
            </button>
          </div>
        ) : reports.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-xl mx-auto mt-6">
            <div className="w-20 h-20 bg-[#f0fae5] rounded-full flex items-center justify-center mx-auto mb-6 text-pawprint-green">
              <Eye className="w-10 h-10" />
            </div>
            <h2 className="text-base font-bold text-gray-900">No Listings Yet</h2>
            <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
              You haven't reported any lost pet alerts or guest sightings yet. Your reports will appear here once submitted.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/report-lost" className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-red-500/10 transition-all">
                Report a Lost Pet
              </Link>
              <Link href="/report" className="bg-pawprint-green hover:bg-[#059669] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-pawprint-green/10 transition-all">
                Submit Sighting
              </Link>
            </div>
          </div>
        ) : (
          /* Listings Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((pet) => {
              const isLost = pet.alert_type === 'LOST';
              const isReunited = pet.status === 'REUNITED';

              return (
                <div 
                  key={pet.id} 
                  className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all duration-300 relative group`}
                >
                  {/* Status Banner */}
                  <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isLost 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {pet.alert_type}
                    </span>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isReunited 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {pet.status}
                    </span>
                  </div>

                  <div>
                    {/* Media Header */}
                    <div className="h-40 w-full bg-gray-100 relative shrink-0 overflow-hidden">
                      {pet.image_url ? (
                        <img 
                          src={pet.image_url} 
                          alt={pet.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-pawprint-dark/5 text-pawprint-dark/30">
                          <Eye className="w-12 h-12 stroke-[1.2]" />
                          <span className="text-[10px] mt-1 font-semibold">No Image Provided</span>
                        </div>
                      )}
                    </div>

                    {/* Listing Content */}
                    <div className="p-6">
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-pawprint-green transition-colors leading-snug">
                        {pet.title}
                      </h3>
                      {pet.breed && (
                        <p className="text-[10px] font-semibold text-pawprint-green mt-0.5 uppercase tracking-wider">
                          {pet.breed}
                        </p>
                      )}

                      <hr className="border-gray-100 my-4" />

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="text-[10px] font-medium truncate">{pet.location_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="text-[10px] font-medium">
                            {new Date(pet.event_time).toLocaleDateString(undefined, { 
                              year: 'numeric', month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Reunited Success Message Display */}
                      {isReunited && pet.reunited_message && (
                        <div className="mt-4 bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex gap-2 text-emerald-800">
                          <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div className="text-[9px] leading-relaxed">
                            <span className="font-bold">Reunion Note: </span>
                            "{pet.reunited_message}"
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
                    <button 
                      onClick={() => {
                        setPetToDelete(pet);
                        setDeleteConfirmOpen(true);
                      }}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {!isReunited && (
                      <button 
                        onClick={() => {
                          setSelectedPet(pet);
                          setReunitedMessage(`${pet.title} has been reunited with their loving family!`);
                          setReunitedModalOpen(true);
                        }}
                        className="bg-white border-2 border-pawprint-green hover:bg-pawprint-green text-pawprint-green hover:text-white transition-all text-[10px] font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <Trophy className="w-3.5 h-3.5" /> Reunited! 🎉
                      </button>
                    )}

                    {isReunited && (
                      <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1 py-2 px-1">
                        <CheckCircle className="w-4 h-4" /> Safe at Home
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MARK REUNITED MODAL */}
      {reunitedModalOpen && selectedPet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-gray-100 animate-scale-up">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Mark as Reunited!</h3>
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
              We are so happy! Mark <span className="font-semibold text-pawprint-green">{selectedPet.title}</span> as reunited to update the live community map and inspire hope!
            </p>

            <div className="mt-4">
              <label className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Share your reunion story
              </label>
              <textarea 
                value={reunitedMessage}
                onChange={(e) => setReunitedMessage(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none h-20 resize-none font-medium text-gray-700"
                placeholder="Write a message (e.g. Found hiding under the porch, safely home now!)"
              />
            </div>

            <div className="mt-6 flex gap-2">
              <button 
                onClick={() => {
                  setReunitedModalOpen(false);
                  setSelectedPet(null);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] py-2.5 rounded-lg transition-colors"
                disabled={modalLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleMarkReunited}
                className="flex-1 bg-pawprint-green hover:bg-[#059669] text-white font-bold text-[11px] py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                disabled={modalLoading}
              >
                {modalLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Confirm Reunited 🎉"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmOpen && petToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xs w-full p-6 border border-gray-100">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Delete Listing?</h3>
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
              Are you sure you want to permanently delete <span className="font-semibold text-red-600">{petToDelete.title}</span>? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-2">
              <button 
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setPetToDelete(null);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] py-2.5 rounded-lg transition-colors"
                disabled={modalLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteReport}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold text-[11px] py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                disabled={modalLoading}
              >
                {modalLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
