import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-5xl font-bold">Whisker</h1>
      <p className="max-w-xl text-zinc-600">
        Self-hostable transcription engine, hosted SaaS, and desktop app — same engine, three deploys.
      </p>
      <div className="flex gap-3">
        <Link href="/sign-up" className="bg-black text-white rounded px-4 py-2">Get started</Link>
        <Link href="/sign-in" className="border rounded px-4 py-2">Sign in</Link>
      </div>
    </main>
  );
}
