import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">Whisker</Link>
          <div className="flex gap-4 text-sm">
            <Link href="/pricing">Pricing</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/about">About</Link>
            <Link href="/sign-in" className="text-zinc-600">Sign in</Link>
            <Link href="/sign-up" className="bg-black text-white rounded px-3 py-1">Sign up</Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-zinc-500 flex flex-wrap gap-4 justify-between">
          <div>© 2026 SYVR Studios</div>
          <div className="flex gap-4">
            <Link href="/docs/self-host">Self-host</Link>
            <Link href="/docs/api-reference">API</Link>
            <a href="https://github.com/basezero-projects/whisker">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
