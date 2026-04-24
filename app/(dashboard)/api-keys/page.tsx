"use client";
import { useEffect, useState } from "react";

interface Key {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  revokedAt: string | null;
  lastUsedAt: string | null;
  fullKey?: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<Key[]>([]);
  const [name, setName] = useState("");
  const [revealed, setRevealed] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/api-keys");
    setKeys(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function create() {
    const res = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const k = await res.json();
    setRevealed(k.fullKey);
    setName("");
    load();
  }

  async function revoke(id: string) {
    await fetch(`/api/api-keys/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="text-2xl font-semibold">API Keys</h1>
      {revealed && (
        <div className="rounded border border-amber-400 bg-amber-50 p-3 text-sm">
          <p className="font-semibold">Copy this now — you won&apos;t see it again:</p>
          <code className="break-all">{revealed}</code>
        </div>
      )}
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="key name" className="border rounded px-3 py-2 flex-1" />
        <button onClick={create} className="bg-black text-white rounded px-3 py-2">Create</button>
      </div>
      <table className="w-full text-sm">
        <thead><tr><th className="text-left">Name</th><th className="text-left">Prefix</th><th>Created</th><th>Last used</th><th></th></tr></thead>
        <tbody>
          {keys.map((k) => (
            <tr key={k.id} className="border-t">
              <td>{k.name}</td>
              <td><code>{k.prefix}…</code></td>
              <td>{new Date(k.createdAt).toLocaleDateString()}</td>
              <td>{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : "—"}</td>
              <td>
                {k.revokedAt ? (
                  <span className="text-zinc-400">revoked</span>
                ) : (
                  <button onClick={() => revoke(k.id)} className="text-red-600">Revoke</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
