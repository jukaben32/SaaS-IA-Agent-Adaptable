import Link from "next/link";
import { Phone, Calendar, Building2, ArrowUpRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-forest text-sand">
      <header className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-pulse-live" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span className="font-display text-lg tracking-tight">EstateCall</span>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/login" className="text-sand/70 hover:text-sand transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="rounded-full bg-accent text-forest-dark px-4 py-2 font-medium hover:bg-accent-dark hover:text-sand transition-colors">
            Get started
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 grid lg:grid-cols-[1.1fr,0.9fr] gap-16 items-center">
        <div>
          <p className="text-accent text-sm font-medium tracking-wide mb-4 flex items-center gap-2">
            <Phone size={14} /> Live AI calling agent
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight text-sand mb-6">
            Your listings, answered <span className="italic text-accent">the moment</span> the phone rings.
          </h1>
          <p className="text-sand/70 text-lg leading-relaxed max-w-xl mb-8">
            EstateCall's AI agents pick up every call, qualify the lead, and book the
            viewing — while your dashboard fills in real time. No missed calls, no manual
            scheduling.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/signup" className="rounded-full bg-accent text-forest-dark px-6 py-3 font-medium hover:bg-sand transition-colors inline-flex items-center gap-2">
              Start free <ArrowUpRight size={16} />
            </Link>
            <Link href="/widget-demo" className="text-sand/80 hover:text-sand text-sm underline underline-offset-4">
              See the widget in action
            </Link>
          </div>
        </div>

        <div className="card !bg-forest-light !border-white/10 p-6 text-sand">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs uppercase tracking-wide text-sand/50">Live call — Alexis</span>
            <span className="badge bg-accent/20 text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-live" /> On call · 2:14
            </span>
          </div>
          <div className="space-y-3 text-sm">
            <p className="text-sand/60">Caller</p>
            <p className="text-sand/90">"What other properties do you have for rent right now?"</p>
            <p className="text-accent/90 pt-2">Alexis</p>
            <p className="text-sand/90">
              "We have three available for rent — the cheapest is a townhouse at
              $10,000/month. Want the details?"
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-sand/70">
              <Building2 size={14} /> 4 active listings
            </div>
            <div className="flex items-center gap-2 text-sand/70">
              <Calendar size={14} /> Viewing → Fri 2:00 PM
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
