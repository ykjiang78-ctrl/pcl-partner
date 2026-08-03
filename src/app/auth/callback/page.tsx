"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        console.error("Auth callback error:", error);
      }

      router.push("/");
      router.refresh();
    };

    handleCallback();
  }, []);

  return (
    <div className="flex items-center justify-center py-20 text-gray-400">
      登录中...
    </div>
  );
}