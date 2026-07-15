import { PortalHeader } from "@/components/layout/PortalHeader";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sand">
      <PortalHeader />
      <main className="max-w-3xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
