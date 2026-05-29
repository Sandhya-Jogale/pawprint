"use client";

import Link from "next/link";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/Logo";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Automatically sign in the user
      const signInRes = await signIn("credentials", {
        redirect: true,
        email: formData.email,
        password: formData.password,
        callbackUrl: "/dashboard",
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen max-w-sm mx-auto p-4">
      <Logo className="w-14 h-14 mb-4" iconClassName="w-8 h-8" />
      <h1 className="text-xl font-bold mb-1 text-white">Create Account</h1>
      <p className="text-[10px] text-gray-400 mb-8 tracking-wider">Join PawPrint and help rescue animals</p>

      <div className="bg-pawprint-form w-full rounded-2xl p-6 shadow-xl mb-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-xs font-semibold text-center mb-4">
                {error}
              </div>
            )}
            
            <div>
                <label className="block text-[10px] text-gray-800 mb-1 font-semibold">Full Name *</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-xs focus:ring-1 focus:ring-pawprint-green outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-[10px] text-gray-800 mb-1 font-semibold">Email Address *</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email" 
                        placeholder="your.email@example.com" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-xs focus:ring-1 focus:ring-pawprint-green outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-[10px] text-gray-800 mb-1 font-semibold">Phone Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        type="tel" 
                        placeholder="(555) 123-4567" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-xs focus:ring-1 focus:ring-pawprint-green outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-[10px] text-gray-800 mb-1 font-semibold">Password *</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        required
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"} 
                        placeholder="Create a strong password" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-10 text-xs focus:ring-1 focus:ring-pawprint-green outline-none"
                    />
                    <button 
                        type="button" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none" 
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-[10px] text-gray-800 mb-1 font-semibold">Confirm Password *</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        required
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Re-enter your password" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-10 text-xs focus:ring-1 focus:ring-pawprint-green outline-none"
                    />
                    <button 
                        type="button" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2 py-2">
                <input required type="checkbox" className="w-3 h-3 text-pawprint-green border-gray-300 rounded" />
                <span className="text-[10px] text-gray-600">I agree to the <Link href="/terms" className="text-pawprint-green font-semibold">Terms of Service</Link> and <Link href="/privacy" className="text-pawprint-green font-semibold">Privacy Policy</Link></span>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-pawprint-green text-white font-bold py-2.5 rounded-lg text-xs hover:bg-[#059669] transition-colors mt-2 disabled:opacity-50">
                {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
            
            <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-100"></div>
                <span className="px-2 text-[10px] text-gray-400 uppercase tracking-widest">or</span>
                <div className="flex-1 border-t border-gray-100"></div>
            </div>

            <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} type="button" className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-lg text-[11px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <span className="flex items-center justify-center w-4 h-4 bg-white rounded-full">
                    {/* Google 'G' icon mock */}
                    <span className="text-red-500 font-bold text-xs">G</span>
                </span>
                Sign up with Google
            </button>
        </form>

        <div className="mt-6 flex justify-center pt-2">
            <span className="text-[10px] text-gray-600">Already have an account? <Link href="/login" className="text-pawprint-green font-bold">Sign In</Link></span>
        </div>
      </div>

      <div className="flex gap-4 text-[10px] text-gray-500">
          <Link href="/about" className="hover:text-gray-300">About</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-gray-300">Privacy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-gray-300">Terms</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>
      </div>
      <p className="text-[9px] text-gray-600 mt-2">© 2026 PawPrint. All rights reserved.</p>
    </div>
  );
}
