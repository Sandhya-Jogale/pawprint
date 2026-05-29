import Link from "next/link";
import { ArrowLeft, Heart, BellRing, Users, ShieldCheck, Star, HeartHandshake, Lock, TrendingUp } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function About() {
  return (
    <div className="min-h-screen bg-pawprint-dark text-white p-6 max-w-2xl mx-auto pb-16">
      <Link href="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Link>

      <div className="flex items-center gap-4 mb-10">
        <Logo className="w-12 h-12" iconClassName="w-7 h-7" />
        <div>
          <h1 className="text-2xl font-bold">About PawPrint</h1>
          <p className="text-pawprint-green text-sm font-medium">Reuniting pets with their families.</p>
        </div>
      </div>

      <div className="space-y-8">
        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Heart className="w-5 h-5 text-pawprint-green" />
            </div>
            <h2 className="text-lg font-bold">Our Mission</h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            PawPrint is a community-powered platform dedicated to reuniting lost pets with their families. We believe every pet deserves to come home safely, and every family deserves peace of mind. Through technology and community collaboration, we make finding lost pets faster, easier, and more effective.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
              <div className="p-2 bg-emerald-500/10 rounded-lg w-fit mb-3">
                <BellRing className="w-4 h-4 text-pawprint-green" />
              </div>
              <h3 className="font-bold text-sm mb-2">Real-Time Alerts</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Report sightings or lost pets instantly. Our interactive map shows real-time locations with color-coded pins for quick identification.
              </p>
            </div>
            <div className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
              <div className="p-2 bg-blue-500/10 rounded-lg w-fit mb-3">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="font-bold text-sm mb-2">Community Power</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Leverage the eyes and hearts of your community. Every member can report sightings, share alerts, and help bring pets home.
              </p>
            </div>
            <div className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
              <div className="p-2 bg-emerald-500/10 rounded-lg w-fit mb-3">
                <ShieldCheck className="w-4 h-4 text-pawprint-green" />
              </div>
              <h3 className="font-bold text-sm mb-2">Safe & Secure</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Your privacy matters. We protect your personal information while facilitating safe communication between community members.
              </p>
            </div>
            <div className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
              <div className="p-2 bg-yellow-500/10 rounded-lg w-fit mb-3">
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
              <h3 className="font-bold text-sm mb-2">Success Stories</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Celebrate reunions with our community. Gold pins on the map showcase successful reunions, building hope and trust.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4">Our Values</h2>
          <div className="space-y-3">
            <div className="bg-[#1e222a] border border-gray-800 rounded-xl p-4 flex gap-3">
              <HeartHandshake className="w-5 h-5 text-yellow-500 shrink-0" />
              <div>
                <h3 className="font-bold text-sm mb-1">Community First</h3>
                <p className="text-xs text-gray-400">We believe in the power of neighbors helping neighbors. Together, we're stronger.</p>
              </div>
            </div>
            <div className="bg-[#1e222a] border border-gray-800 rounded-xl p-4 flex gap-3">
              <Heart className="w-5 h-5 text-pawprint-green shrink-0" />
              <div>
                <h3 className="font-bold text-sm mb-1">Compassion Always</h3>
                <p className="text-xs text-gray-400">Every lost pet represents a family in distress. We treat every case with empathy and urgency.</p>
              </div>
            </div>
            <div className="bg-[#1e222a] border border-gray-800 rounded-xl p-4 flex gap-3">
              <Lock className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <h3 className="font-bold text-sm mb-1">Privacy Protected</h3>
                <p className="text-xs text-gray-400">Your data is yours. We protect your information and never sell it to third parties.</p>
              </div>
            </div>
            <div className="bg-[#1e222a] border border-gray-800 rounded-xl p-4 flex gap-3">
              <TrendingUp className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <h3 className="font-bold text-sm mb-1">Continuous Improvement</h3>
                <p className="text-xs text-gray-400">We listen to our community and constantly evolve to better serve pet owners and animal lovers.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-pawprint-green rounded-xl p-8 text-center mt-12 shadow-lg shadow-pawprint-green/20">
          <h2 className="text-xl font-bold text-white mb-3">Join Our Community</h2>
          <p className="text-emerald-100 text-sm mb-6 max-w-sm mx-auto">
            Together, we can make sure every pet finds their way home. Sign up today and help us build a safer world for our furry friends.
          </p>
          <Link href="/register" className="inline-block bg-white text-pawprint-green font-bold px-8 py-3 rounded-lg text-sm hover:bg-gray-50 transition-colors shadow-sm">
            Get Started
          </Link>
        </section>
      </div>

      <div className="mt-16 text-center text-xs text-gray-500">
        Have questions? Visit our <Link href="/terms" className="text-pawprint-green hover:underline">Terms</Link> or <Link href="/privacy" className="text-pawprint-green hover:underline">Privacy Policy</Link>
      </div>
    </div>
  );
}
