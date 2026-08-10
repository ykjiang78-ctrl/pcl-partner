"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  const router = useRouter();
  const supabase = createClient();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/auth/login");
      } else {
        setChecking(false);
      }
    });
  }, []);

  if (checking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 text-center text-gray-400">
        检查登录状态...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">📝 发布找搭子</h1>
      <div className="card card-hover p-6">
        <PostForm />
      </div>
    </div>
  );
}