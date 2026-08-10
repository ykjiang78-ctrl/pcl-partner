import { createClient } from "@supabase/supabase-js";

/**
 * 创建 Supabase Admin 客户端（使用 Service Role Key）
 * 仅在 API 路由（服务端）使用，可绕过 RLS
 * 永远不要在客户端代码中使用！
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
