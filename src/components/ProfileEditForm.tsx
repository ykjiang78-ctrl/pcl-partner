"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function ProfileEditForm({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("nickname, bio, avatar_url")
        .eq("id", userId)
        .single();

      if (data) {
        setNickname(data.nickname || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || "");
      }
      setFetching(false);
    };
    fetchProfile();
  }, [userId, supabase]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型和大小
    if (!file.type.startsWith("image/")) {
      setError("请选择图片文件");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("图片大小不能超过 2MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 如果已有旧头像，先删除
      if (avatarUrl) {
        try {
          const oldPath = avatarUrl.split("/avatars/")[1]?.split("?")[0];
          if (oldPath) {
            await supabase.storage.from("avatars").remove([`avatars/${oldPath}`]);
          }
        } catch {
          // 忽略删除失败
        }
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        setError("上传失败：" + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        setAvatarUrl(urlData.publicUrl);
      }
    } catch (err: any) {
      setError("上传失败：" + err.message);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("profiles")
      .update({
        nickname: nickname.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })
      .eq("id", userId);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("保存成功！");
      router.refresh();
    }
    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="text-center py-8 text-gray-400">加载中...</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>
      )}
      {success && (
        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{success}</div>
      )}

      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-16 h-16 rounded-full border-2 border-indigo-100 object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl">👤</div>
        )}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-200 transition disabled:opacity-50"
          >
            {uploading ? "上传中..." : "📷 上传头像"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <p className="text-xs text-gray-400">支持 JPG/PNG，最大 2MB</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">头像链接</label>
        <input
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="粘贴头像图片 URL 或上传图片"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <p className="text-xs text-gray-400 mt-1">上传图片或直接粘贴图片链接</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          placeholder="你的昵称"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={200}
          placeholder="介绍一下自己，喜欢什么游戏..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y"
        />
        <p className="text-xs text-gray-400 mt-1">{bio.length}/200</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition disabled:opacity-50"
      >
        {loading ? "保存中..." : "💾 保存修改"}
      </button>
    </form>
  );
}
