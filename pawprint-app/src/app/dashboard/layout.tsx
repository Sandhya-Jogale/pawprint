import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-pawprint-dark overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  );
}
