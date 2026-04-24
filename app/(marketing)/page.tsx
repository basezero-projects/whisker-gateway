import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <section className="py-20 text-center space-y-6">
        <h1 className="text-6xl font-bold tracking-tight">Whisker</h1>
        <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
          Self-hostable transcription engine, hosted SaaS, and desktop app — same engine, three deploys.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/sign-up" className="bg-black text-white rounded px-5 py-2.5 font-medium">Get started — 60 free minutes/month</Link>
          <Link href="/docs" className="border rounded px-5 py-2.5">Docs</Link>
        </div>
      </section>

      <section className="py-12 grid md:grid-cols-3 gap-6 text-sm">
        <div className="border rounded p-4 space-y-2">
          <h3 className="font-semibold">Hosted SaaS</h3>
          <p>Hit <code>api.whisker.syvr.dev</code> with an API key. Pay per minute.</p>
        </div>
        <div className="border rounded p-4 space-y-2">
          <h3 className="font-semibold">Self-host</h3>
          <p>Pull <code>ghcr.io/basezero-projects/whisker-engine</code>. Bring your own GPU.</p>
        </div>
        <div className="border rounded p-4 space-y-2">
          <h3 className="font-semibold">Desktop</h3>
          <p>Tauri-packaged Whisker for macOS + Windows. Local GPU, offline-friendly.</p>
        </div>
      </section>
    </div>
  );
}
