import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";

export default async function DocsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const file = path.join(process.cwd(), "app/(docs)/docs-content", slug.join("/") + ".mdx");
  if (!fs.existsSync(file)) return notFound();
  const source = fs.readFileSync(file, "utf-8");
  return (
    <article className="max-w-3xl mx-auto px-4 py-16 prose prose-zinc">
      <MDXRemote source={source} />
    </article>
  );
}
