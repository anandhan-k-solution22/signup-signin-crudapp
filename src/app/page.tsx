"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [blockRedirect, setBlockRedirect] = useState(false); // 🚀 new state


  useEffect(() => {
    if (user && !blockRedirect) {
      router.replace("/crud");
    }
  }, [user, blockRedirect, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setBlockRedirect(false);

    try {
      // Step 1: Try signing in to check if user exists
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginData.user) {
        // ✅ User exists, show error instead of redirecting
        setErrorMsg("User already exists. Please sign in instead.");
        setBlockRedirect(true); // stop the redirect
        await supabase.auth.signOut(); // also sign them out immediately
        setLoading(false);
        return;
      }

      if (loginError && loginError.message !== "Invalid login credentials") {
        throw loginError;
      }

      // Step 2: Sign up new user
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      alert("Check your email to confirm (if confirmation is enabled).");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="border rounded w-full p-2"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border rounded w-full p-2"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-black text-white rounded p-2"
          disabled={loading}
        >
          {loading ? "Creating…" : "Sign up"}
        </button>
      </form>

      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/signin" className="underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
