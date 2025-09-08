"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

type AuthCtx = { session: Session | null; user: User | null; loading: boolean };
const AuthContext = createContext<AuthCtx>({ session: null, user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // 2) subscribe to changes (sign in/out, token refresh)
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, ses) => {
      setSession(ses);
      setUser(ses?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
