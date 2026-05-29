"use client";

import Link from "next/link";
import { CheckCircle, MapPin, BellRing, Mail, ArrowRight, Share2, PlusCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const type = searchParams.get("type"); // "lost" or "sighting"

  const isLost = type === "lost";
  const backLink = status === "authenticated" ? "/dashboard" : "/explore";

  return (
    <div className="min-h-screen bg-pawprint-dark flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-50 rounded-full opacity-50 pointer-events-none"></div>

        <div className="flex justify-center mb-6 relative">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <CheckCircle className="w-10 h-10 text-pawprint-green animate-[bounce_1s_ease-in-out_1]" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isLost ? "Report Submitted Successfully!" : "Thank You for Your Sighting!"}
        </h1>
        
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          {isLost 
            ? "Your lost pet alert has been recorded. Our community is now on the lookout." 
            : "Your sighting has been recorded. You are helping to bring a pet back home."}
        </p>

        <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100 text-left">
          <h2 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-wider">What happens next?</h2>
          
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="bg-emerald-100 p-1.5 rounded-full shrink-0">
                <MapPin className="w-4 h-4 text-pawprint-green" />
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-gray-900 mb-0.5">Live on the Map</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Your report is now visible as a pin on our live community map for everyone in the area to see.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="bg-blue-100 p-1.5 rounded-full shrink-0">
                <BellRing className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-gray-900 mb-0.5">Community Notified</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  {isLost 
                    ? "Users in your vicinity will see this alert and keep their eyes open."
                    : "If this matches a lost pet profile, the owner will be notified immediately."}
                </p>
              </div>
            </li>

            {isLost && (
              <li className="flex items-start gap-3">
                <div className="bg-purple-100 p-1.5 rounded-full shrink-0">
                  <Mail className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-gray-900 mb-0.5">Check Your Email</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    We will send you notifications if any community members report a matching sighting.
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>

        <div className="space-y-3">
          <Link 
            href={backLink} 
            className="w-full bg-pawprint-green text-white font-bold py-3.5 rounded-xl text-xs hover:bg-[#059669] transition-all flex items-center justify-center shadow-lg shadow-pawprint-green/20"
          >
            Go to Live Map <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: isLost ? 'Lost Pet Alert!' : 'Found Pet Sighting!',
                    text: 'Help us find this pet on PawPrint!',
                    url: window.location.origin + '/explore',
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(window.location.origin + '/explore');
                  alert('Link copied to clipboard!');
                }
              }}
              className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-xs hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <Share2 className="w-3.5 h-3.5 mr-2" /> Share Alert
            </button>
            <Link 
              href={isLost ? "/report-lost" : "/report"} 
              className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-xs hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-2" /> Report Another
            </Link>
          </div>
        </div>

      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
         <Logo className="w-6 h-6" iconClassName="w-4 h-4" />
         <span className="text-white/50 text-[10px] font-medium tracking-wide">PAWPRINT</span>
      </div>
    </div>
  );
}

export default function ReportSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-pawprint-dark flex items-center justify-center"><div className="w-8 h-8 border-4 border-pawprint-green border-t-transparent rounded-full animate-spin"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
