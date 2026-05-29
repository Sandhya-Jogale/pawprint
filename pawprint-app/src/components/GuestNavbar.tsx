import Link from "next/link";
import { Logo } from "@/components/Logo";

export function GuestNavbar() {
  return (
    <div className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <Link href="/" className="flex items-center gap-2">
        <Logo className="w-8 h-8" iconClassName="w-5 h-5" />
        <span className="font-bold text-gray-900">PawPrint</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/success-stories" className="text-xs font-bold text-gray-500 hover:text-pawprint-green transition-colors flex items-center gap-1">
          Success Stories
        </Link>
        <Link href="/login" className="border-2 border-pawprint-green text-pawprint-green font-bold text-xs px-6 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
          Login / Sign Up
        </Link>
      </div>
    </div>
  );
}
