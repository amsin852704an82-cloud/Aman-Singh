-- ==============================================================================
-- BharatConnect (भारत कनेक्ट) - Instagram-Scale Database Schema & Fan-out on Write
-- ==============================================================================

-- 1. प्रोफाइल्स टेबल (यूज़र की बेसिक जानकारी के लिए)
create table if not exists profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. फॉलोअर्स टेबल (कौन किसे फॉलो करता है)
create table if not exists follows (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references profiles(id) on delete cascade not null,
  followee_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(follower_id, followee_id) -- एक यूज़र दूसरे को दोबारा फॉलो न कर सके
);

-- फॉलोअर्स खोजने में तेज़ी के लिए इंडेक्स
create index if not exists idx_follows_follower on follows(follower_id);
create index if not exists idx_follows_followee on follows(followee_id);

-- 3. पोस्ट्स टेबल (सारी पोस्ट यहाँ सेव होंगी)
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  image_url text not null,
  caption text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- लेटेस्ट पोस्ट जल्दी लोड हों, इसके लिए इंडेक्स
create index if not exists idx_posts_user_created on posts(user_id, created_at desc);

-- 4. फ़ीड इनबॉक्स टेबल (आम यूज़र्स के लिए "Push / Fan-out on Write" मॉडल)
create table if not exists feed_inbox (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null, -- किस यूज़र के इनबॉक्स में पोस्ट आई है
  post_id uuid references posts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- यूज़र का फ़ीड तुरंत लोड करने के लिए इंडेक्स
create index if not exists idx_feed_inbox_user_created on feed_inbox(user_id, created_at desc);

-- ==============================================================================
-- 5. AUTOMATED TRIGGER: Fan-Out on Write (पोस्ट पब्लिश होते ही फ़ीड इनबॉक्स में पुश)
-- ==============================================================================

create or replace function fan_out_post_to_feed_inbox()
returns trigger as $$
begin
  -- ऑथर के सभी फॉलोअर्स के इनबॉक्स में यह पोस्ट डालें
  insert into feed_inbox (user_id, post_id, created_at)
  select follower_id, NEW.id, NEW.created_at
  from follows
  where followee_id = NEW.user_id;

  -- ऑथर के अपने इनबॉक्स में भी डालें ताकि वह अपनी टाइमलाइन पर भी देख सके
  insert into feed_inbox (user_id, post_id, created_at)
  values (NEW.user_id, NEW.id, NEW.created_at);

  return NEW;
end;
$$ language plpgsql security definer;

-- ट्रिगर अटैच करें
drop trigger if exists trigger_fan_out_post on posts;
create trigger trigger_fan_out_post
after insert on posts
for each row
execute function fan_out_post_to_feed_inbox();

-- ==============================================================================
-- 6. ULTRA-FAST O(1) FEED QUERY EXAMPLE (यूज़र की होम फ़ीड प्राप्त करने के लिए)
-- ==============================================================================
-- select 
--   p.id, 
--   p.image_url, 
--   p.caption, 
--   p.created_at, 
--   pr.username, 
--   pr.full_name, 
--   pr.avatar_url
-- from feed_inbox fi
-- join posts p on fi.post_id = p.id
-- join profiles pr on p.user_id = pr.id
-- where fi.user_id = 'USER_UUID_HERE'
-- order by fi.created_at desc
-- limit 20;
