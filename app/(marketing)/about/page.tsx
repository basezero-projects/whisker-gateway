import Link from "next/link";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 text-zinc-700">
      <h1 className="text-4xl font-bold text-zinc-900">About Whisker</h1>
      <p>Whisker is a transcription engine built around <code>faster-whisper</code> with first-class support for self-hosting.</p>
      <h2 className="text-2xl font-semibold text-zinc-900 mt-8">Three ways to use it</h2>
      <ul className="space-y-3">
        <li>
          <strong>Hosted API.</strong> Sign up at <Link href="/sign-up" className="underline">whisker.syvr.dev</Link>, grab an API key, hit <code>POST /api/v1/transcribe</code>. We run the GPUs.
        </li>
        <li>
          <strong>Self-host Docker.</strong> <code>docker pull ghcr.io/basezero-projects/whisker-engine</code> — the same image our hosted SaaS runs.
        </li>
        <li>
          <strong>Desktop app.</strong> Local GPU, no Python install needed. <a href="https://github.com/basezero-projects/whisker/releases" className="underline">Releases</a>.
        </li>
      </ul>
      <h2 className="text-2xl font-semibold text-zinc-900 mt-8">Why one engine?</h2>
      <p>Same engine in all three deploys means features ship to all three on the same release. No "which Whisker do you mean?"</p>
    </div>
  );
}
