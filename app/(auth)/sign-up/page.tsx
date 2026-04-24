"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await authClient.signUp.email({ email, password, name });
    if (error) {
      setError(error.message ?? "Sign-up failed");
      return;
    }
    await fetch("/api/orgs/me", { method: "POST" });
    window.location.href = "/api-keys";
  }

  return (
    <main className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Sign up</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="name" className="w-full border rounded px-3 py-2" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email" className="w-full border rounded px-3 py-2" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password (8+ chars)" className="w-full border rounded px-3 py-2" />
        <button type="submit" className="w-full bg-black text-white rounded px-3 py-2">Create account</button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </main>
  );
}
