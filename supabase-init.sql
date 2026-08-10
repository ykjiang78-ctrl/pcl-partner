-- ============================================
-- PCL找搭子 - 数据库初始化 SQL
-- 在 Supabase SQL Editor 中执行
-- ============================================

-- 1. profiles 用户资料表
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  avatar_url text,
  bio text,
  phone text,
  is_vip boolean default false,
  vip_expires_at timestamptz,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Public read profiles" on profiles for select using (true);
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- 2. posts 帖子表
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  game text not null,
  title text not null,
  description text,
  contact text not null,
  platform text,
  game_version text,
  max_players integer,
  current_players integer default 1,
  expires_at timestamptz,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now()
);

alter table posts enable row level security;
create policy "Public read posts" on posts for select using (true);
create policy "Auth users can create posts" on posts for insert with check (auth.uid() = user_id);
create policy "Authors can update posts" on posts for update using (auth.uid() = user_id);
create policy "Authors can delete posts" on posts for delete using (auth.uid() = user_id);

-- 3. replies 留言表
create table if not exists replies (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now()
);

alter table replies enable row level security;
create policy "Public read replies" on replies for select using (true);
create policy "Auth users can create replies" on replies for insert with check (auth.uid() = user_id);
create policy "Authors can delete replies" on replies for delete using (auth.uid() = user_id);

-- 4. favorites 收藏表
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

alter table favorites enable row level security;
create policy "Public read favorites" on favorites for select using (true);
create policy "Users create own favorites" on favorites for insert with check (auth.uid() = user_id);
create policy "Users delete own favorites" on favorites for delete using (auth.uid() = user_id);

-- 5. reports 举报表
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade not null,
  reporter_id uuid references profiles(id) on delete cascade not null,
  reason text not null,
  detail text,
  created_at timestamptz default now()
);

alter table reports enable row level security;
create policy "Users create reports" on reports for insert with check (auth.uid() = reporter_id);

-- 6. orders 订单表
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  trade_order_id text not null unique,
  transaction_id text,
  order_type text not null check (order_type in ('boost', 'vip')),
  amount numeric(10,2) not null,
  pay_method text check (pay_method in ('wechat', 'alipay')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  metadata jsonb default '{}',
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_trade_order_id on orders(trade_order_id);
create index if not exists idx_orders_status on orders(status);

alter table orders enable row level security;
create policy "Users read own orders" on orders for select using (auth.uid() = user_id);
create policy "Users create own orders" on orders for insert with check (auth.uid() = user_id);

-- 7. post_boosts 置顶表
create table if not exists post_boosts (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  order_id uuid references orders(id) on delete cascade not null,
  boost_days integer not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create index if not exists idx_post_boosts_post_id on post_boosts(post_id);
create index if not exists idx_post_boosts_expires_at on post_boosts(expires_at);

alter table post_boosts enable row level security;
create policy "Public read boosts" on post_boosts for select using (true);
create policy "Users create own boosts" on post_boosts for insert with check (auth.uid() = user_id);

-- 8. user_memberships 会员表
create table if not exists user_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  order_id uuid references orders(id) on delete cascade not null,
  plan text not null default 'monthly',
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_user_memberships_user_id on user_memberships(user_id);
create index if not exists idx_user_memberships_expires_at on user_memberships(expires_at);

alter table user_memberships enable row level security;
create policy "Public read memberships" on user_memberships for select using (true);

-- ============================================
-- Storage: 头像上传
-- ============================================

-- 创建 avatars bucket（如果不存在）
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 允许登录用户上传头像
create policy "Users can upload own avatar"
on storage.objects for insert
with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- 允许用户更新自己的头像
create policy "Users can update own avatar"
on storage.objects for update
using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- 允许公开读取头像
create policy "Public read avatars"
on storage.objects for select
using (bucket_id = 'avatars');

-- 允许用户删除自己的头像
create policy "Users can delete own avatar"
on storage.objects for delete
using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- 触发器：新用户注册自动创建 profile
-- ============================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
as $$
begin
  insert into public.profiles (id, nickname, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- 删除旧触发器（如果存在）再创建
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 附录 A：功能升级（一次性执行，幂等）
-- ---------------------------------------------------------
-- 新增：点赞 / 关注 / 公告 / 建议反馈 / 通知
-- 所有语句均可重复执行，不会报错。
-- 执行后在 Supabase SQL Editor 直接运行即可。
-- ============================================

-- A1. 点赞表
create table if not exists post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

create index if not exists idx_post_likes_post_id on post_likes(post_id);
create index if not exists idx_post_likes_user_id on post_likes(user_id);

alter table post_likes enable row level security;
create policy "Public read post_likes" on post_likes for select using (true);
create policy "Users like own" on post_likes for insert with check (auth.uid() = user_id);
create policy "Users unlike own" on post_likes for delete using (auth.uid() = user_id);

-- A2. 关注表
create table if not exists follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references profiles(id) on delete cascade not null,
  following_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(follower_id, following_id)
);

create index if not exists idx_follows_follower on follows(follower_id);
create index if not exists idx_follows_following on follows(following_id);

alter table follows enable row level security;
create policy "Public read follows" on follows for select using (true);
create policy "Users follow" on follows for insert with check (auth.uid() = follower_id);
create policy "Users unfollow" on follows for delete using (auth.uid() = follower_id);

-- A3. 公告表（发布公告需在 Dashboard 后台手动插入）
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  is_pinned boolean default false,
  created_at timestamptz default now(),
  expires_at timestamptz
);

create index if not exists idx_announcements_pinned on announcements(is_pinned);

alter table announcements enable row level security;
create policy "Public read announcements" on announcements for select using (true);

-- A4. 建议反馈表
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  category text not null default 'general',
  content text not null,
  contact text,
  status text not null default 'open',
  created_at timestamptz default now()
);

create index if not exists idx_feedback_user on feedback(user_id);

alter table feedback enable row level security;
create policy "Public read feedback" on feedback for select using (true);
create policy "Users insert feedback" on feedback for insert with check (auth.uid() = user_id);

-- A5. 通知表
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  type text not null default 'reply' check (type in ('reply', 'follow', 'system')),
  actor_id uuid references profiles(id) on delete cascade,
  post_id uuid references posts(id) on delete cascade,
  title text,
  body text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_notifications_user on notifications(user_id, is_read);

alter table notifications enable row level security;
create policy "Users read own notifications" on notifications for select using (auth.uid() = user_id);
create policy "Users update own notifications" on notifications for update using (auth.uid() = user_id);

-- A6. 触发器：新人留言 → 通知帖子作者
create or replace function public.notify_on_reply()
returns trigger
language plpgsql
as $$
declare
  v_author uuid;
begin
  select p.user_id into v_author from posts p where p.id = new.post_id;
  if v_author is not null and new.user_id <> v_author then
    insert into notifications (user_id, type, actor_id, post_id, title, body)
    values (v_author, 'reply', new.user_id, new.post_id, '你收到一条新留言', left(new.text, 200));
  end if;
  return new;
end;
$$;

drop trigger if exists on_reply_create on replies;
create trigger on_reply_create
  after insert on replies
  for each row execute function public.notify_on_reply();

-- A7. 触发器：关注成功 → 通知被关注者
create or replace function public.notify_on_follow()
returns trigger
language plpgsql
as $$
begin
  if new.follower_id <> new.following_id then
    insert into notifications (user_id, type, actor_id, title, body)
    values (new.following_id, 'follow', new.follower_id, '你有了新的粉丝', '');
  end if;
  return new;
end;
$$;

drop trigger if exists on_follow_create on follows;
create trigger on_follow_create
  after insert on follows
  for each row execute function public.notify_on_follow();
