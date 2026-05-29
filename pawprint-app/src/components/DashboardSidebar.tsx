"use client";

import Link from "next/link";
import { Home, Eye, Settings, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "My", href: "/dashboard/my-reports", icon: Eye },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="w-20 bg-white h-full flex flex-col items-center py-6 border-r border-gray-100 shrink-0 z-50">
      <div className="mb-8">
        <Logo className="w-10 h-10" iconClassName="w-6 h-6" />
      </div>

      <nav className="flex-1 flex flex-col gap-6 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex flex-col items-center gap-1 relative ${isActive ? 'text-pawprint-green' : 'text-gray-400 hover:text-pawprint-green transition-colors'}`}
            >
              <div className={isActive ? 'bg-emerald-50 p-2 rounded-xl' : 'p-2'}>
                 <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[9px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-pawprint-green rounded-r-md"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100 w-full">
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex flex-col items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
          <div className="p-2">
             <LogOut className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
