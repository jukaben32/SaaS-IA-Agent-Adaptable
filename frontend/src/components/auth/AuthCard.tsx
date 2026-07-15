import Link from "next/link";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-sand flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 justify-center mb-10">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="font-display text-lg tracking-tight text-forest">EstateCall</span>
        </Link>
        <div className="card p-8">
          <h1 className="font-display text-2xl text-ink mb-1">{title}</h1>
          <p className="text-sm text-muted mb-6">{subtitle}</p>
          {children}
        </div>
        <p className="text-center text-sm text-muted mt-6">{footer}</p>
      </div>
    </main>
  );
}
