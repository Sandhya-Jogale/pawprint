"use client";

import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/Logo";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen max-w-sm mx-auto p-4">
      <Logo className="w-12 h-12 mb-3" iconClassName="w-7 h-7" />
      <h1 className="text-lg font-bold mb-0.5 text-white">PawPrint</h1>
      <p className="text-[9px] text-gray-400 mb-6 tracking-wide">Animal Rescue & Lost Pet Platform</p>

      <div className="bg-[#f0fae5] w-full rounded-tl-2xl rounded-tr-2xl p-6 shadow-xl relative border-b-2 border-dashed border-gray-200">
        <span className="absolute -top-2 left-6 bg-[#d1fae5] text-pawprint-green text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Guest Access</span>
        <h2 className="text-sm font-bold text-gray-900 mb-1">Found an Animal?</h2>
        <p className="text-[10px] text-gray-600 mb-4 leading-relaxed">
            Report a sighting instantly without an account. Help reunite lost pets with their families.
        </p>
        <div className="space-y-2">
            <Link href="/report" className="w-full bg-pawprint-green text-white font-bold py-2 rounded-lg text-[11px] hover:bg-[#059669] transition-colors flex justify-center text-center">
                Report Sighting as Guest
            </Link>
            <Link href="/explore" className="w-full bg-white border border-pawprint-green text-pawprint-green font-bold py-2 rounded-lg text-[11px] hover:bg-emerald-50 transition-colors flex justify-center text-center">
                Quick Browse Sightings
            </Link>
        </div>
        <p className="text-center text-[8px] text-gray-400 mt-3 font-medium">No registration required • Does not save</p>
      </div>
      
      <div className="flex w-full items-center justify-center -mt-3 z-10 relative">
          <span className="bg-pawprint-dark w-6 h-6 rounded-full border border-gray-200 text-gray-300 text-[8px] flex items-center justify-center italic">or</span>
      </div>

      <div className="bg-white w-full rounded-bl-2xl rounded-br-2xl p-6 shadow-xl mb-6 -mt-3 pt-6">
        <span className="bg-gray-100 text-gray-600 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 block w-fit">Secure Portal</span>
        <h2 className="text-sm font-bold text-gray-900 mb-1">Dashboard Login</h2>
        <p className="text-[10px] text-gray-500 mb-4 tracking-tight">Manage listings and report lost pets.</p>

        <form className="space-y-3" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-xs font-semibold text-center mb-2">
                {error}
              </div>
            )}
            <div>
                <label className="block text-[9px] text-gray-800 mb-1 font-semibold">Email or Phone</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text" 
                        placeholder="your.email@example.com" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-[9px] text-gray-800 mb-1 font-semibold">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-8 text-[11px] focus:ring-1 focus:ring-pawprint-green outline-none"
                    />
                    <button 
                        type="button" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none" 
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-1.5">
                    <input type="checkbox" className="w-3 h-3 text-pawprint-green border-gray-300 rounded cursor-pointer" />
                    <span className="text-[9px] text-gray-600">Remember me</span>
                </div>
                <Link href="/reset-password" className="text-[9px] text-pawprint-green font-semibold">Forgot password?</Link>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-[#111827] text-white font-bold py-2 rounded-lg text-[11px] hover:bg-black transition-colors block text-center disabled:opacity-50">
                {isSubmitting ? "Logging in..." : "Login"}
            </button>
            
            <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} type="button" className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-2 rounded-lg text-[10px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 mt-2">
                <span className="flex items-center justify-center w-3 h-3 bg-white rounded-full">
                    <span className="text-blue-500 font-bold text-[10px]">G</span>
                </span>
                Sign in with Google
            </button>
        </form>

        <div className="mt-4 flex justify-center">
            <span className="text-[9px] text-gray-500">Don't have an account? <Link href="/register" className="text-pawprint-green font-bold">Sign up</Link></span>
        </div>
      </div>

      <div className="flex gap-3 text-[9px] text-gray-500 font-medium">
          <Link href="/about" className="hover:text-gray-300">About</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-gray-300">Privacy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-gray-300">Terms</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>
      </div>
      <p className="text-[8px] text-gray-600 mt-2">© 2026 PawPrint. All rights reserved.</p>
    </div>
  );
}
