import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * API 路由中验证用户身份
 * 优先从 Authorization header 获取 token，其次从 cookies
 */
export async function getAuthenticatedUser(request: Request) {
  // 尝试从 Authorization header 获取 Bearer token
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (token) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );
    const { data } = await supabase.auth.getUser(token);
    return data.user;
  }

  // 回退到 cookies
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );
  const { data } = await supabase.auth.getUser();
  return data.user;
}
