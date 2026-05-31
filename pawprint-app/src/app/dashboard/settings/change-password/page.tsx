"use client";

import { useState } from "react";
import { ArrowLeft, Key, Save, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ChangePassword() {
  const { data: session } = useSession();
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to change password.");
      }

      setSuccessMsg("Your password has been successfully updated!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Redirect back after a short delay
      setTimeout(() => {
        router.push("/dashboard/settings");
      }, 2000);
      
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 h-full overflow-y-auto font-sans">
      <div className="max-w-2xl mx-auto pt-12 pb-6 px-4">
        <Link href="/dashboard/settings" className="inline-flex items-center text-[11px] text-gray-500 hover:text-pawprint-green font-bold mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Settings
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Key className="w-6 h-6 text-pawprint-green" /> Change Password
        </h1>
        <p className="text-[11px] text-gray-500 font-medium">Ensure your account is using a long, random password to stay secure.</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-24 space-y-6">
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs font-semibold animate-fade-in flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-xs font-semibold animate-fade-in flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <span>{successMsg} Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <label className="block text-[10px] text-gray-600 mb-1 font-bold">Current Password</label>
            <input 
              type="password" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] font-semibold text-gray-800 focus:ring-1 focus:ring-pawprint-green outline-none" 
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-600 mb-1 font-bold">New Password</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] font-semibold text-gray-800 focus:ring-1 focus:ring-pawprint-green outline-none" 
              placeholder="Minimum 6 characters"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-600 mb-1 font-bold">Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] font-semibold text-gray-800 focus:ring-1 focus:ring-pawprint-green outline-none" 
              placeholder="Confirm new password"
              required
              minLength={6}
            />
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
                  Updating Password...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
