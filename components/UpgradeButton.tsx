"use client";
import { useState } from "react";

export default function UpgradeButton({ label }: { label: string }) {
  const [loading, setLoading] = useState(false);
  async function go() {
    setLoading(true);
    const res = await fetch("/api/billing/checkout", { method: "POST" });
    const j = await res.json();
    if (j.url) window.location.href = j.url;
    else setLoading(false);
  }
  return (
    <button onClick={go} disabled={loading} className="bg-black text-white rounded px-4 py-2">
      {loading ? "Loading…" : label}
    </button>
  );
}
