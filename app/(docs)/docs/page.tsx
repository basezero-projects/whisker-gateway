import Link from "next/link";

const pages = [
  { slug: "quickstart", title: "Quickstart", desc: "Sign up, get an API key, transcribe in 3 minutes." },
  { slug: "api-reference", title: "API reference", desc: "All public endpoints, request/response shapes." },
  { slug: "self-host", title: "Self-host guide", desc: "Run the engine Docker image on your own infra." },
];

export default function DocsIndex() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-4xl font-bold">Documentation</h1>
      <ul className="space-y-4">
        {pages.map((p) => (
          <li key={p.slug} className="border rounded p-4">
            <Link href={`/docs/${p.slug}`} className="text-xl font-semibold underline">{p.title}</Link>
            <p className="text-zinc-600 mt-1">{p.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
