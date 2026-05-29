import Link from "next/link";
import { CheckCircle, ArrowLeft, Home } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function ContactSuccess() {
  return (
    <div className="min-h-screen bg-pawprint-dark flex flex-col items-center justify-center p-6 text-center text-white relative">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="z-10 bg-[#1e222a] border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-pawprint-green" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Message Sent!</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Thank you for reaching out to us. We have received your message and our team will get back to you at the email address provided as soon as possible.
        </p>

        <div className="space-y-3">
          <Link 
            href="/dashboard" 
            className="w-full bg-pawprint-green text-white font-bold py-3 rounded-lg text-sm hover:bg-[#059669] transition-colors flex justify-center items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </Link>
          <Link 
            href="/contact" 
            className="w-full bg-transparent border border-gray-700 text-gray-300 font-bold py-3 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors flex justify-center items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Send Another Message
          </Link>
        </div>
      </div>
      
      <div className="mt-8 z-10 flex items-center gap-2">
        <Logo className="w-6 h-6" iconClassName="w-4 h-4" />
        <span className="text-xs text-gray-500 font-medium">PawPrint Support</span>
      </div>
    </div>
  );
}
