"use client";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      className="border rounded px-3 py-1"
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/signin");
      }}
    >
      Sign out
    </button>
  );
}
