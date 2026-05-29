import Link from "next/link";
import { ArrowLeft, Shield, User, MapPin, Eye, Lock, Clock, CheckCircle, Search } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-pawprint-dark text-white p-6 max-w-3xl mx-auto pb-16">
      <Link href="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-500 rounded-lg">
          <Shield className="w-6 h-6 text-pawprint-dark" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
          <p className="text-gray-500 text-xs">Last updated: April 9, 2024</p>
        </div>
      </div>

      <div className="space-y-4">
        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-2">Your Privacy Matters</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            At PawPrint, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our platform.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed mt-2">
            By accessing or using our service, you consent to the practices described in this policy. Please read this policy carefully to understand our views and practices.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold mb-3 mt-6">1. Information We Collect</h2>
          <div className="space-y-3">
            <div className="bg-[#1e222a] border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-gray-200">Personal Information</h3>
              </div>
              <p className="text-xs text-gray-400 mb-2">When you create an account or report a lost pet, we may collect:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
                <li>Name and contact information (email, phone number)</li>
                <li>Location data (for mapping sightings and lost pet reports)</li>
                <li>Profile picture (if you choose to provide one)</li>
                <li>Pet information (name, description, species, breed)</li>
              </ul>
            </div>

            <div className="bg-[#1e222a] border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-gray-200">Usage Data</h3>
              </div>
              <p className="text-xs text-gray-400 mb-2">We automatically collect certain information about your device and how you interact with our platform:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
                <li>Device information (browser type, operating system, IP address)</li>
                <li>Usage patterns (pages visited, time spent, links clicked)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            <div className="bg-[#1e222a] border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-bold text-gray-200">Location Data</h3>
              </div>
              <p className="text-xs text-gray-400">
                With your permission, we collect and process your precise location to show nearby alerts and report sightings. You can disable location access in your device settings at any time.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5 mt-6">
          <h2 className="text-sm font-bold mb-3">2. How We Use Your Information</h2>
          <p className="text-xs text-gray-400 mb-3">We use the information we collect to:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide and maintain the PawPrint platform</li>
              <li>Notify you about relevant lost pet alerts</li>
              <li>Facilitate communication between users</li>
              <li>Comply with legal obligations</li>
            </ul>
            <ul className="list-disc pl-5 space-y-1">
              <li>Improve and optimize our platform</li>
              <li>Protect against fraud and abuse</li>
              <li>Measure the effectiveness of our services</li>
              <li>Send administrative notices and updates</li>
            </ul>
          </div>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-3">3. How We Share Your Information</h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-gray-200">Community Members</h3>
              <p className="text-xs text-gray-400 mt-1">When you report a sighting or lost pet, certain information (location, pet details, photo) will be visible to other community members. Your exact contact details remain private unless you choose to share them.</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-pawprint-green">We Do NOT Sell Your Data</h3>
              <p className="text-xs text-gray-400 mt-1">PawPrint will never sell or rent your personal information to third parties for marketing purposes. Your trust is our top priority.</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-200">Service Providers</h3>
              <p className="text-xs text-gray-400 mt-1">We may share data with trusted third-party service providers (hosting, analytics, email delivery) who assist us in operating our platform. They are bound by confidentiality obligations.</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-200">Legal Requirements</h3>
              <p className="text-xs text-gray-400 mt-1">We may disclose information if required by law, court order, or to protect the rights, property, or safety of PawPrint, our users, or others.</p>
            </div>
          </div>
        </section>

        <section className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-emerald-400">4. Data Security</h2>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            We implement robust physical, technical, and administrative security measures to protect your personal information from unauthorized access, use, alteration, or destruction.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-xs text-gray-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              All data transmitted is encrypted (HTTPS/TLS)
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              Passwords are hashed using industry-standard algorithms
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              Regular security audits and updates
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              Strict access controls for our personnel
            </li>
          </ul>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold">5. Data Retention</h2>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-2">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
            <li><strong>Active Accounts:</strong> Data retained until you delete your account.</li>
            <li><strong>Resolved Reports:</strong> Retained for historical context and successful reunion metrics.</li>
            <li><strong>Deleted Accounts:</strong> Data is anonymized or permanently deleted within 30 days.</li>
          </ul>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-3">6. Your Privacy Rights</h2>
          <p className="text-xs text-gray-400 mb-3">You have the following rights regarding your personal data:</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-pawprint-dark rounded-lg p-3 border border-gray-800">
              <h3 className="text-xs font-bold text-gray-200 mb-1">Access & Portability</h3>
              <p className="text-[10px] text-gray-500">Request a copy of your data</p>
            </div>
            <div className="bg-pawprint-dark rounded-lg p-3 border border-gray-800">
              <h3 className="text-xs font-bold text-gray-200 mb-1">Correction</h3>
              <p className="text-[10px] text-gray-500">Update inaccurate data</p>
            </div>
            <div className="bg-pawprint-dark rounded-lg p-3 border border-gray-800">
              <h3 className="text-xs font-bold text-gray-200 mb-1">Deletion</h3>
              <p className="text-[10px] text-gray-500">Request deletion of your data</p>
            </div>
            <div className="bg-pawprint-dark rounded-lg p-3 border border-gray-800">
              <h3 className="text-xs font-bold text-gray-200 mb-1">Opt-Out</h3>
              <p className="text-[10px] text-gray-500">Opt-out of promotional communications</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-500">To exercise these rights, please contact us at <a href="mailto:privacy@pawprint.com" className="text-pawprint-green hover:underline">privacy@pawprint.com</a>.</p>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold">7. Cookies and Tracking Technologies</h2>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            PawPrint uses cookies and similar technologies to enhance your experience, analyze usage, and personalize content. You can control cookies through your browser settings, but disabling them may limit some platform functionality.
          </p>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-2">8. International Data Transfers</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using PawPrint, you consent to such transfers.
          </p>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-2">9. Third-Party Links</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any personal information.
          </p>
        </section>

        <section className="bg-[#1e222a] border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-2">10. Changes to This Privacy Policy</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting a notice on our platform or sending an email. Your continued use of the platform after changes constitutes acceptance.
          </p>
        </section>

        <section className="bg-gradient-to-r from-[#2c1c38] to-[#1a1c29] border border-purple-500/20 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-3 text-purple-200">GDPR & CCPA Compliance</h2>
          <p className="text-[10px] text-purple-200/70 mb-3">If you are a resident of the European Economic Area (EEA) or California, you have additional rights:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold text-purple-300 mb-1">EEA Residents (GDPR)</h3>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-purple-200/60">
                <li>Right to access personal data</li>
                <li>Right to rectification</li>
                <li>Right to erasure ("Right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-purple-300 mb-1">California Residents (CCPA)</h3>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-purple-200/60">
                <li>Right to know what data is collected</li>
                <li>Right to delete personal information</li>
                <li>Right to opt-out of sale of data (we do not sell data)</li>
                <li>Right to non-discrimination</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center mt-8">
          <p className="text-xs text-emerald-400 font-medium">
            By using PawPrint, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
