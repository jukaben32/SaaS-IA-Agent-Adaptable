import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-sand">
      <DashboardSidebar />
      <div className="flex-1 min-w-0">
        <main className="max-w-6xl mx-auto px-8 py-10">{children}</main>
      </div>
    </div>
  );
}
