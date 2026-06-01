"use client";

import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function ResetPassword() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen max-w-sm mx-auto p-4">
      <Logo className="w-14 h-14 mb-4" iconClassName="w-8 h-8" />
      <h1 className="text-xl font-bold mb-1 text-white">Reset Password</h1>
      <p className="text-[10px] text-gray-400 mb-8 tracking-wider">Recover your PawPrint account</p>

      <div className="bg-pawprint-form w-full rounded-2xl p-6 shadow-xl mb-6">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
            <span className="bg-[#d1fae5] rounded-full p-1"><Mail className="w-4 h-4 text-pawprint-green" /></span>
            Enter Your Email
        </h2>
        <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
            We'll send you a link to reset your password and recover your account.
        </p>

        <div className="space-y-4">
            <div>
                <label className="block text-[10px] text-gray-500 mb-1 font-medium">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="email" 
                        placeholder="your.email@example.com" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-pawprint-green placeholder-gray-400"
                    />
                </div>
            </div>

            <button 
                type="button"
                onClick={() => alert("Success! A password reset link has been sent to your email address.")}
                className="w-full bg-[#6ee7b7] text-white font-bold py-2.5 rounded-lg text-xs hover:bg-[#34d399] transition-colors mt-2"
            >
                Send Reset Link
            </button>
        </div>

        <div className="mt-6 flex justify-center border-t border-gray-100 pt-4">
            <Link href="/login" className="text-xs text-gray-600 hover:text-pawprint-green flex items-center gap-1 font-medium">
                <ArrowLeft className="w-3 h-3" /> Back to Login
            </Link>
        </div>
      </div>

      <div className="flex gap-4 text-[10px] text-gray-500">
          <Link href="/about" className="hover:text-gray-300">About</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-gray-300">Privacy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-gray-300">Terms</Link>
      </div>
      <p className="text-[9px] text-gray-600 mt-2">© 2026 PawPrint. All rights reserved.</p>
    </div>
  );
}
