"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await authClient.signIn.email({ email, password });
    if (error) setError(error.message ?? "Sign-in failed");
    else window.location.href = "/library";
  }

  return (
    <main className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email" className="w-full border rounded px-3 py-2" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" className="w-full border rounded px-3 py-2" />
        <button type="submit" className="w-full bg-black text-white rounded px-3 py-2">Sign in</button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </main>
  );
}
