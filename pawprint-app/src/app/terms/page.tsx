import Link from "next/link";
import { ArrowLeft, FileText, X } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-pawprint-dark text-white p-6 max-w-3xl mx-auto pb-16">
      <Link href="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-emerald-500 rounded-lg">
          <FileText className="w-6 h-6 text-pawprint-dark" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Terms of Service</h1>
          <p className="text-gray-500 text-xs">Last updated: April 9, 2024</p>
        </div>
      </div>

      <div className="space-y-4">
        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-2">Welcome to PawPrint</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            These Terms of Service ("Terms") govern your use of the PawPrint platform and services. By accessing or using PawPrint, you agree to be bound by these Terms.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed mt-2">
            Please read these terms carefully before using our service. If you don't agree with these terms, please do not use PawPrint.
          </p>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-2">1. Acceptance of Terms</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            By creating an account or using PawPrint, you affirm that you are at least 18 years old or have parental/guardian consent, and you have the legal capacity to enter into these Terms.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed mt-2">
            We reserve the right to modify these Terms at any time. Continued use of the service after changes constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-3">2. User Accounts and Responsibilities</h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-gray-200">Account Security</h3>
              <p className="text-xs text-gray-400 mt-1">You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access or security breach.</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-200">Accurate Information</h3>
              <p className="text-xs text-gray-400 mt-1">You agree to provide accurate, current, and complete information when creating reports or profiles. False information may result in account suspension or termination.</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-200">One Account Per User</h3>
              <p className="text-xs text-gray-400 mt-1">Users may maintain only one account. Multiple accounts may be merged or terminated at our discretion.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-3">3. Acceptable Use Policy</h2>
          <p className="text-xs text-gray-400 mb-3">You agree NOT to use PawPrint to:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-xs text-gray-400">
              <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              Post false, misleading, or fraudulent information about lost or found pets
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-400">
              <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              Harass, threaten, or abuse other users
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-400">
              <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              Violate any local, state, national, or international laws
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-400">
              <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              Collect or store personal data of other users without consent
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-400">
              <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              Use automated systems or bots to access the service
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-400">
              <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              Attempt to gain unauthorized access to our systems or other user accounts
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-400">
              <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              Use the platform for commercial purposes without written permission
            </li>
          </ul>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-3">4. User-Generated Content</h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-gray-200">Your Content</h3>
              <p className="text-xs text-gray-400 mt-1">You retain ownership of all content you post (photos, descriptions, reports). By posting, you grant PawPrint a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content for the purpose of operating the service.</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-200">Content Moderation</h3>
              <p className="text-xs text-gray-400 mt-1">PawPrint reserves the right to remove any content that violates these Terms, is offensive, or is deemed inappropriate. We may, but are not obligated to, monitor or review user content.</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-200">Copyright & Intellectual Property</h3>
              <p className="text-xs text-gray-400 mt-1">You represent that you own or have permission to use all content you post. Do not upload copyrighted material without proper authorization.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-2">5. Service Availability and Modifications</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            PawPrint is provided "as is" and "as available." We strive for 99.9% uptime but do not guarantee uninterrupted access. The service may be temporarily unavailable due to maintenance, updates, or technical issues.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed mt-2">
            We reserve the right to modify, suspend, or discontinue any part of the service at any time with or without notice.
          </p>
        </section>

        <section className="bg-[#2d1b11] border border-[#4a2e1b] rounded-xl p-5">
          <h2 className="text-sm font-bold mb-2 text-orange-400">6. Disclaimer of Warranties</h2>
          <p className="text-xs text-orange-200/70 leading-relaxed">
            <strong className="text-orange-400">IMPORTANT:</strong> PawPrint is a community platform designed to assist in reuniting lost pets. We do not guarantee successful reunions and are not responsible for the accuracy of user-submitted information.
          </p>
          <p className="text-xs text-orange-200/70 leading-relaxed mt-2">
            The service is provided without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
          </p>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-2">7. Indemnification</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            You agree to indemnify and hold harmless PawPrint from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the service, violation of these Terms, or infringement of any third-party rights.
          </p>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-2">8. Privacy and Data Protection</h2>
          <p className="text-xs text-gray-400 leading-relaxed mb-2">
            Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
          </p>
          <Link href="/privacy" className="text-xs text-pawprint-green hover:underline">
            Read our Privacy Policy →
          </Link>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-2">9. Account Termination</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            You may terminate your account at any time by contacting us or using account settings. Upon termination, your right to use the service ceases immediately.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed mt-2">
            We may suspend or terminate your account at our discretion if you violate these Terms or engage in prohibited activities. We will provide notice when possible, but reserve the right to immediate termination for serious violations.
          </p>
        </section>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center mt-8">
          <p className="text-xs text-emerald-400 font-medium">
            By using PawPrint, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
