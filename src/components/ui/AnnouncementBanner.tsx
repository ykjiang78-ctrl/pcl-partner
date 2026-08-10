"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";

interface Announcement {
  id: string;
  title: string;
  content: string | null;
  is_pinned: boolean;
}

export default function AnnouncementBanner() {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchAnn = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("id, title, content, is_pinned")
        .is("expires_at", null)
        .or("expires_at.gt." + new Date().toISOString())
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(5);
      if (data && data.length > 0) {
        setAnnouncements(data);
      }
    };
    fetchAnn();
  }, [supabase]);

  if (announcements.length === 0) return null;
  const ann = announcements[current];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white p-4 shadow-glow-lg">
      <div className="absolute top-0 left-0 h-full w-24 bg-white/10 blur-2xl -skew-x-12" />
      <div className="flex items-start gap-3 relative">
        <span className="text-2xl shrink-0">📣</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="chip bg-white/20 text-white">公告</span>
            <span className="font-semibold text-sm truncate">{ann.title}</span>
          </div>
          {ann.content && (
            <p className="text-xs text-white/85 mt-1 line-clamp-2">
              {ann.content}
            </p>
          )}
        </div>
        {announcements.length > 1 && (
          <button
            onClick={() =>
              setCurrent((c) => (c + 1) % announcements.length)
            }
            className="shrink-0 text-xs text-white/70 hover:text-white transition"
          >
            {current + 1}/{announcements.length}
          </button>
        )}
      </div>
    </div>
  );
}