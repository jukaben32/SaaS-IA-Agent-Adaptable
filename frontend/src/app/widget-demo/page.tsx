import { CallWidget } from "@/components/widget/CallWidget";

export default function WidgetDemoPage() {
  return (
    <main className="min-h-screen bg-sand flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="text-accent text-sm font-medium mb-2">Widget demo</p>
        <h1 className="font-display text-3xl text-ink mb-3">Embed this on any page</h1>
        <p className="text-muted text-sm">
          This is the exact widget your agents get on their EstateCall micro-site. Click
          the button in the bottom-right corner to try the call flow.
        </p>
      </div>
      <CallWidget />
    </main>
  );
}
