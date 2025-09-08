"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/crud");
  }, [user, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/crud");
    } catch (err) {
      // ✅ no `any` here
      if (err instanceof Error) {
        alert(err.message); // shows e.g. "Invalid login credentials"
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="border rounded w-full p-2"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
        <input
          className="border rounded w-full p-2"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-black text-white rounded p-2" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm">
        New here?{" "}
        <Link href="/" className="underline">Create an account</Link>
      </p>
    </div>
  );
}
