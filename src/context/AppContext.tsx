import React, { createContext, useContext, useState, useTransition } from 'react';
import { 
  ActiveTab, 
  Post, 
  Reel, 
  Story,
  VirtualGift,
  GiftTransaction,
  CreatorEarningsState,
  WithdrawalRecord,
  DatabaseTable, 
  RedisKeyItem, 
  MinioObjectItem, 
  User 
} from '../types';
import { 
  INITIAL_POSTS, 
  INITIAL_REELS, 
  INITIAL_STORIES,
  VIRTUAL_GIFTS,
  INITIAL_GIFT_TRANSACTIONS,
  INITIAL_CREATOR_EARNINGS,
  INITIAL_WITHDRAWALS,
  INITIAL_DB_TABLES, 
  INITIAL_REDIS_KEYS, 
  INITIAL_MINIO_OBJECTS, 
  CURRENT_USER,
  INITIAL_USERS
} from '../data/initialData';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User;
  users: User[];
  setCurrentUserById: (userId: string) => void;
  signupUser: (dto: { username: string; email: string; password: string; full_name: string }) => { user: User; access_token: string };
  posts: Post[];
  reels: Reel[];
  stories: Story[];
  gifts: VirtualGift[];
  giftTransactions: GiftTransaction[];
  creatorEarnings: CreatorEarningsState[];
  withdrawals: WithdrawalRecord[];
  dbTables: DatabaseTable[];
  redisKeys: RedisKeyItem[];
  minioObjects: MinioObjectItem[];
  notification: string | null;
  setNotification: (msg: string | null) => void;
  createPost: (content: string, language: Post['language'], mediaUrl?: string, tags?: string[], locationName?: string) => void;
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  sendGift: (giftId: string, postId: string, receiverId: string) => void;
  requestWithdrawal: (creatorId: string, amountPaise: number, upiId: string) => void;
  uploadMinioFile: (bucket: string, filename: string, sizeBytes: number, mimeType: string) => string;
  runSqlQuery: (sql: string) => { columns: string[]; rows: (string | number | boolean | null)[][]; durationMs: number; error?: string };
  setRedisKey: (key: string, value: string, type: RedisKeyItem['type'], ttl: number) => void;
  deleteRedisKey: (key: string) => void;
  flushRedisCache: () => void;
  systemMetrics: {
    postgresStatus: 'Healthy' | 'Degraded';
    postgresPort: number;
    redisStatus: 'Healthy' | 'Degraded';
    redisPort: number;
    redisMemoryMb: number;
    minioStatus: 'Healthy' | 'Degraded';
    minioPort: number;
    totalBuckets: number;
    totalObjects: number;
    totalTables: number;
  };
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('app');
  const [, startTransition] = useTransition();
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  const setCurrentUserById = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      notify(`Switched active profile to ${found.fullName} (${found.handle})`);
    }
  };

  const signupUser = (dto: { username: string; email: string; password: string; full_name: string }) => {
    const normalizedUsername = dto.username.toLowerCase().trim();
    const normalizedEmail = dto.email.toLowerCase().trim();

    // Check if user already exists
    const existing = users.find(
      (u) => u.username.toLowerCase() === normalizedUsername || u.email?.toLowerCase() === normalizedEmail
    );
    if (existing) {
      notify(`Conflict: User with username '${normalizedUsername}' or email already exists`);
      throw new Error('User already exists');
    }

    // Hash password simulation (bcrypt salt 12)
    const password_hash = `$2b$12$eX9K3...${Math.random().toString(36).substring(2, 15)}`;
    const newUserId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

    const newUser: User = {
      id: newUserId,
      username: normalizedUsername,
      fullName: dto.full_name.trim(),
      handle: `@${normalizedUsername}`,
      email: normalizedEmail,
      phone: '+919' + Math.floor(100000000 + Math.random() * 900000000),
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      bio: 'New member on Bharat Social platform.',
      location: 'India',
      verified: true,
      role: 'Developer',
      followersCount: 0,
      followingCount: 0,
      postCount: 0,
      language: 'hi'
    };

    // Generate JWT access token
    const access_token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ sub: newUserId, username: normalizedUsername }))}.sig_${Math.random().toString(36).substring(2, 10)}`;

    startTransition(() => {
      // 1. Add to users state
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);

      // 2. Insert into PostgreSQL 'users' table
      setDbTables((prev) =>
        prev.map((tbl) => {
          if (tbl.name === 'users') {
            const dbRow = {
              id: newUserId,
              username: normalizedUsername,
              email: normalizedEmail,
              phone: newUser.phone || null,
              full_name: newUser.fullName,
              language: 'hi',
              is_verified: true,
              follower_count: 0,
              following_count: 0,
              post_count: 0,
              deleted_at: null
            };
            return {
              ...tbl,
              rowCount: tbl.rowCount + 1,
              rows: [...tbl.rows, dbRow]
            };
          }
          return tbl;
        })
      );

      // 3. Cache session in Redis
      setRedisKeys((prev) => [
        {
          key: `session:bharat_usr_${normalizedUsername}`,
          type: 'hash',
          ttl: 86400,
          value: JSON.stringify({ userId: newUserId, username: normalizedUsername, role: 'Developer' }),
          sizeBytes: 190,
          updatedAt: 'Just now'
        },
        ...prev
      ]);
    });

    notify(`User @${normalizedUsername} registered in PostgreSQL 'users' & JWT session initiated`);
    return { user: newUser, access_token };
  };
  const [reels] = useState<Reel[]>(INITIAL_REELS);
  const [stories] = useState<Story[]>(INITIAL_STORIES);
  const [gifts] = useState<VirtualGift[]>(VIRTUAL_GIFTS);
  const [giftTransactions, setGiftTransactions] = useState<GiftTransaction[]>(INITIAL_GIFT_TRANSACTIONS);
  const [creatorEarnings, setCreatorEarnings] = useState<CreatorEarningsState[]>(INITIAL_CREATOR_EARNINGS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(INITIAL_WITHDRAWALS);
  const [dbTables, setDbTables] = useState<DatabaseTable[]>(INITIAL_DB_TABLES);
  const [redisKeys, setRedisKeys] = useState<RedisKeyItem[]>(INITIAL_REDIS_KEYS);
  const [minioObjects, setMinioObjects] = useState<MinioObjectItem[]>(INITIAL_MINIO_OBJECTS);
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  const createPost = (
    content: string, 
    language: Post['language'] = 'English', 
    mediaUrl?: string, 
    tags: string[] = ['TechBharat'],
    locationName: string = 'Bengaluru, Karnataka'
  ) => {
    const newId = `post_uuid_${Date.now().toString().slice(-6)}`;
    const newPost: Post = {
      id: newId,
      userId: currentUser.id,
      author: currentUser,
      content,
      language,
      mediaUrl,
      mediaType: mediaUrl ? 'image' : undefined,
      tags: tags.length ? tags : ['BharatSocial'],
      likesCount: 0,
      commentCount: 0,
      saveCount: 0,
      shareCount: 0,
      viewCount: 1,
      hasLiked: false,
      moderationStatus: 'approved',
      createdAt: 'Just now',
      region: currentUser.location.split(',')[0],
      locationName
    };

    startTransition(() => {
      // 1. Update In-App Feed
      setPosts((prev) => [newPost, ...prev]);

      // 2. Synchronize to PostgreSQL 'posts' table and trigger user post_count
      setDbTables((prev) =>
        prev.map((tbl) => {
          if (tbl.name === 'posts') {
            const newRow = {
              id: newId,
              user_id: currentUser.id,
              caption: content.slice(0, 100),
              media_type: mediaUrl ? 'image' : 'text',
              location_name: locationName,
              like_count: 0,
              comment_count: 0,
              moderation_status: 'approved',
              created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
            };
            return {
              ...tbl,
              rowCount: tbl.rowCount + 1,
              rows: [newRow, ...tbl.rows]
            };
          }
          if (tbl.name === 'users') {
            return {
              ...tbl,
              rows: tbl.rows.map((r) => {
                if (r.id === currentUser.id) {
                  return { ...r, post_count: Number(r.post_count || 0) + 1 };
                }
                return r;
              })
            };
          }
          return tbl;
        })
      );

      // 3. Invalidate & update Redis timeline
      setRedisKeys((prev) => [
        {
          key: `feed:user:${currentUser.id}:timeline`,
          type: 'zset',
          ttl: 600,
          value: `[+ "${newId}": ${Math.floor(Date.now() / 1000)}]`,
          sizeBytes: 340,
          updatedAt: 'Just now'
        },
        ...prev.filter((k) => k.key !== `feed:user:${currentUser.id}:timeline`)
      ]);
    });

    notify(`Synced to PostgreSQL 'posts' & 'trg_post_count' trigger executed (+1 post_count)`);
  };

  const toggleLikePost = (postId: string) => {
    let nowLiked = false;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          nowLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked: nowLiked,
            likesCount: p.likesCount + (nowLiked ? 1 : -1)
          };
        }
        return p;
      })
    );

    // Sync to PostgreSQL 'likes' table and trigger 'trg_like_count'
    setDbTables((prev) =>
      prev.map((tbl) => {
        if (tbl.name === 'likes') {
          if (nowLiked) {
            const newLikeRow = {
              id: `lk-${Date.now().toString().slice(-4)}`,
              user_id: currentUser.id,
              post_id: postId,
              created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
            };
            return { ...tbl, rowCount: tbl.rowCount + 1, rows: [newLikeRow, ...tbl.rows] };
          } else {
            return {
              ...tbl,
              rowCount: Math.max(0, tbl.rowCount - 1),
              rows: tbl.rows.filter((r) => !(r.user_id === currentUser.id && r.post_id === postId))
            };
          }
        }
        if (tbl.name === 'posts') {
          return {
            ...tbl,
            rows: tbl.rows.map((r) => {
              if (r.id === postId) {
                return { ...r, like_count: Number(r.like_count || 0) + (nowLiked ? 1 : -1) };
              }
              return r;
            })
          };
        }
        return tbl;
      })
    );

    notify(`Trigger 'trg_like_count' fired on 'likes' table (${nowLiked ? '+1' : '-1'})`);
  };

  const toggleSavePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isSaved = !p.hasSaved;
          return {
            ...p,
            hasSaved: isSaved,
            saveCount: (p.saveCount || 0) + (isSaved ? 1 : -1)
          };
        }
        return p;
      })
    );
    notify(`Updated 'saves' table in PostgreSQL`);
  };

  const sendGift = (giftId: string, postId: string, receiverId: string) => {
    const gift = gifts.find((g) => g.id === giftId);
    if (!gift) return;

    // 1 coin = ₹1 (100 paise)
    // 70% goes to creator in paise, 30% platform commission
    const totalPaise = gift.coinPrice * 100;
    const creatorPaise = Math.round(totalPaise * 0.7);
    const platformPaise = totalPaise - creatorPaise;

    const newTx: GiftTransaction = {
      id: `gtx_${Date.now().toString().slice(-6)}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      receiverId,
      receiverName: receiverId === 'b1ffcd88-8b1a-3de7-aa5c-5aa8ac270b22' ? 'Priya Patel' : 'Aarav Sharma',
      giftName: gift.name,
      giftIcon: gift.icon,
      postId,
      coinAmount: gift.coinPrice,
      creatorEarningPaise: creatorPaise,
      platformCommissionPaise: platformPaise,
      createdAt: 'Just now'
    };

    setGiftTransactions((prev) => [newTx, ...prev]);

    // Update Creator Earnings balance
    setCreatorEarnings((prev) =>
      prev.map((ce) => {
        if (ce.creatorId === receiverId) {
          return {
            ...ce,
            totalEarnedPaise: ce.totalEarnedPaise + creatorPaise,
            availableBalancePaise: ce.availableBalancePaise + creatorPaise
          };
        }
        return ce;
      })
    );

    // Sync to PostgreSQL gift_transactions table
    setDbTables((prev) =>
      prev.map((tbl) => {
        if (tbl.name === 'gift_transactions') {
          return {
            ...tbl,
            rowCount: tbl.rowCount + 1,
            rows: [
              {
                id: newTx.id,
                sender_id: currentUser.id,
                receiver_id: receiverId,
                coin_amount: gift.coinPrice,
                creator_earning_paise: creatorPaise,
                platform_commission_paise: platformPaise,
                created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
              },
              ...tbl.rows
            ]
          };
        }
        if (tbl.name === 'creator_earnings') {
          return {
            ...tbl,
            rows: tbl.rows.map((r) => {
              if (r.creator_id === receiverId) {
                return {
                  ...r,
                  total_earned_paise: Number(r.total_earned_paise || 0) + creatorPaise,
                  available_balance_paise: Number(r.available_balance_paise || 0) + creatorPaise
                };
              }
              return r;
            })
          };
        }
        return tbl;
      })
    );

    notify(
      `Sent ${gift.icon} ${gift.name}! Creator earned ₹${(creatorPaise / 100).toFixed(2)} (70%), Platform fee ₹${(platformPaise / 100).toFixed(2)} (30%)`
    );
  };

  const requestWithdrawal = (creatorId: string, amountPaise: number, upiId: string) => {
    // 1% TDS under Section 194-O of Indian Income Tax Act
    const tdsPaise = Math.round(amountPaise * 0.01);
    const netAmountPaise = amountPaise - tdsPaise;
    const razorpayPayoutId = `pout_RZP${Date.now().toString().slice(-7)}`;

    const newWithdrawal: WithdrawalRecord = {
      id: `wdr_${Date.now().toString().slice(-6)}`,
      creatorId,
      amountPaise,
      tdsPaise,
      netAmountPaise,
      status: 'completed',
      upiId,
      razorpayPayoutId,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    setWithdrawals((prev) => [newWithdrawal, ...prev]);

    // Deduct from creator earnings
    setCreatorEarnings((prev) =>
      prev.map((ce) => {
        if (ce.creatorId === creatorId) {
          return {
            ...ce,
            availableBalancePaise: Math.max(0, ce.availableBalancePaise - amountPaise),
            withdrawnPaise: ce.withdrawnPaise + amountPaise
          };
        }
        return ce;
      })
    );

    // Sync to PostgreSQL withdrawals table
    setDbTables((prev) =>
      prev.map((tbl) => {
        if (tbl.name === 'withdrawals') {
          return {
            ...tbl,
            rowCount: tbl.rowCount + 1,
            rows: [
              {
                id: newWithdrawal.id,
                creator_id: creatorId,
                amount_paise: amountPaise,
                tds_paise: tdsPaise,
                net_amount_paise: netAmountPaise,
                status: 'completed',
                upi_id: upiId,
                razorpay_payout_id: razorpayPayoutId,
                created_at: newWithdrawal.createdAt
              },
              ...tbl.rows
            ]
          };
        }
        return tbl;
      })
    );

    notify(
      `UPI Payout Disbursed: ₹${(netAmountPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })} (1% Section 194-O TDS ₹${(tdsPaise / 100).toFixed(2)} withheld) to ${upiId}`
    );
  };

  const uploadMinioFile = (bucket: string, filename: string, sizeBytes: number, mimeType: string): string => {
    const s3Path = `http://localhost:9000/${bucket}/${filename}`;
    const newObj: MinioObjectItem = {
      name: `${bucket}/${filename}`,
      bucket,
      size: sizeBytes,
      mimeType,
      url: s3Path,
      lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    setMinioObjects((prev) => [newObj, ...prev]);
    notify(`Direct MinIO upload success: ${bucket}/${filename} (Port 9000)`);
    return s3Path;
  };

  const runSqlQuery = (sql: string) => {
    const clean = sql.trim().toLowerCase();
    const duration = +(Math.random() * 2 + 0.6).toFixed(2);

    // Check for table matches across all 19 tables
    for (const table of dbTables) {
      if (clean.includes(`from ${table.name}`)) {
        return {
          columns: table.columns.map((c) => c.name),
          rows: table.rows.map((r) => table.columns.map((c) => r[c.name] ?? null)),
          durationMs: duration
        };
      }
    }

    // Default SELECT 1 or generic response
    return {
      columns: ['status', 'query_executed', 'engine'],
      rows: [['SUCCESS', sql.slice(0, 45) + '...', 'PostgreSQL 14+ on x86_64-pc-linux-musl']],
      durationMs: duration
    };
  };

  const setRedisKey = (key: string, value: string, type: RedisKeyItem['type'] = 'string', ttl: number = 300) => {
    const updated: RedisKeyItem = {
      key,
      value,
      type,
      ttl,
      sizeBytes: new Blob([value]).size,
      updatedAt: 'Just now'
    };
    setRedisKeys((prev) => [updated, ...prev.filter((k) => k.key !== key)]);
    notify(`Redis SET "${key}" [type=${type}, ttl=${ttl}s]`);
  };

  const deleteRedisKey = (key: string) => {
    setRedisKeys((prev) => prev.filter((k) => k.key !== key));
    notify(`Redis DEL "${key}"`);
  };

  const flushRedisCache = () => {
    setRedisKeys([]);
    notify('Redis FLUSHALL executed: All keys evicted');
  };

  const systemMetrics = {
    postgresStatus: 'Healthy' as const,
    postgresPort: 5432,
    redisStatus: 'Healthy' as const,
    redisPort: 6379,
    redisMemoryMb: 28.4,
    minioStatus: 'Healthy' as const,
    minioPort: 9000,
    totalBuckets: 4,
    totalObjects: minioObjects.length,
    totalTables: dbTables.length
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        users,
        setCurrentUserById,
        signupUser,
        posts,
        reels,
        stories,
        gifts,
        giftTransactions,
        creatorEarnings,
        withdrawals,
        dbTables,
        redisKeys,
        minioObjects,
        notification,
        setNotification,
        createPost,
        toggleLikePost,
        toggleSavePost,
        sendGift,
        requestWithdrawal,
        uploadMinioFile,
        runSqlQuery,
        setRedisKey,
        deleteRedisKey,
        flushRedisCache,
        systemMetrics
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
