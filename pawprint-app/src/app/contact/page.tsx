"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Contact() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request before redirect
    setTimeout(() => {
      router.push('/contact/success');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-pawprint-dark text-white p-6 max-w-2xl mx-auto pb-16">
      <Link href="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Link>

      <div className="flex items-center gap-4 mb-10">
        <Logo className="w-12 h-12" iconClassName="w-7 h-7" />
        <div>
          <h1 className="text-2xl font-bold">Contact Us</h1>
          <p className="text-pawprint-green text-sm font-medium">We're here to help you and your pets.</p>
        </div>
      </div>

      <div className="space-y-8">
        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-300 leading-relaxed mb-6">
            Whether you have a question about our platform, need help reporting a lost pet, or want to share a success story, our team is ready to assist you.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-black/20 rounded-lg border border-gray-800/50">
              <div className="p-2 bg-emerald-500/10 rounded-lg mt-0.5">
                <Mail className="w-5 h-5 text-pawprint-green" />
              </div>
              <div>
                <h3 className="text-sm font-bold mb-1">Email Support</h3>
                <p className="text-xs text-gray-400 mb-1">Our team typically responds within 2 hours.</p>
                <a href="mailto:support@pawprint.com" className="text-sm text-pawprint-green font-semibold hover:underline">support@pawprint.com</a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-black/20 rounded-lg border border-gray-800/50">
              <div className="p-2 bg-blue-500/10 rounded-lg mt-0.5">
                <Phone className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold mb-1">Phone</h3>
                <p className="text-xs text-gray-400 mb-1">Available Mon-Fri, 9am - 6pm EST.</p>
                <a href="tel:+18005550199" className="text-sm text-blue-400 font-semibold hover:underline">1 (800) 555-0199</a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-black/20 rounded-lg border border-gray-800/50">
              <div className="p-2 bg-purple-500/10 rounded-lg mt-0.5">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold mb-1">Headquarters</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  123 Rescue Way, Suite 100<br />
                  Portland, OR 97204<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-orange-400" />
            </div>
            <h2 className="text-lg font-bold">Send us a message</h2>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-black/20 border border-gray-800 rounded-lg py-2.5 px-3 text-sm focus:ring-1 focus:ring-pawprint-green outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="w-full bg-black/20 border border-gray-800 rounded-lg py-2.5 px-3 text-sm focus:ring-1 focus:ring-pawprint-green outline-none text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">Subject</label>
              <select className="w-full bg-black/20 border border-gray-800 rounded-lg py-2.5 px-3 text-sm focus:ring-1 focus:ring-pawprint-green outline-none text-white appearance-none">
                <option value="support">General Support</option>
                <option value="report">Issue with a Report</option>
                <option value="feedback">Feedback & Suggestions</option>
                <option value="business">Business Partnership</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">Message</label>
              <textarea 
                rows={4}
                placeholder="How can we help you?" 
                className="w-full bg-black/20 border border-gray-800 rounded-lg py-3 px-3 text-sm focus:ring-1 focus:ring-pawprint-green outline-none text-white resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-pawprint-green text-white font-bold py-3 rounded-lg text-sm hover:bg-[#059669] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </div>

      <div className="mt-12 text-center text-xs text-gray-500">
        In an emergency regarding a pet's immediate safety, please contact your local animal control or emergency vet services.
      </div>
    </div>
  );
}
