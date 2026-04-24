import Link from "next/link";
import { requireSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  if (!session) redirect("/sign-in");
  return (
    <div className="min-h-screen flex">
      <nav className="w-56 border-r p-4 space-y-2">
        <Link href="/library" className="block">Library</Link>
        <Link href="/api-keys" className="block">API Keys</Link>
        <Link href="/usage" className="block">Usage</Link>
        <Link href="/billing" className="block">Billing</Link>
      </nav>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
