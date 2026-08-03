"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

type SupabaseContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export const useUser = () => useContext(SupabaseContext);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        router.refresh();
      }
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <SupabaseContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </SupabaseContext.Provider>
  );
}