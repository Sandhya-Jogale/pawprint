"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center cursor-pointer" onClick={() => router.push("/login")}>
      <div className="flex flex-col items-center animate-pulse cursor-pointer">
        <Logo className="w-20 h-20 mb-4" iconClassName="w-12 h-12" />
        <h1 className="text-pawprint-green text-3xl font-bold tracking-wide">PawPrint</h1>
      </div>
      <p className="text-gray-500 text-xs mt-12 opacity-60">Tap to continue</p>
    </div>
  );
}
