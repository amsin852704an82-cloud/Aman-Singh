import { PrismaClient } from '@prisma/client';
import { INITIAL_USERS } from '../data/initialData';
import { INITIAL_GROUPS, INITIAL_EVENTS, INITIAL_PRODUCTS, INITIAL_CREATOR_STATS } from '../data/communityData';

// Singleton Prisma Client
let prismaInstance: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
    });
  }
  return prismaInstance;
}

export const dbService = {
  // Check if PostgreSQL is configured and connected
  isDatabaseConfigured(): boolean {
    return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres'));
  },

  // Active database health check with latency measurement
  async checkDatabase(): Promise<{ status: 'up' | 'down'; latency_ms: number; error?: string }> {
    const startedAt = Date.now();
    if (!this.isDatabaseConfigured()) {
      return {
        status: 'up',
        latency_ms: Date.now() - startedAt
      };
    }

    try {
      const prisma = getPrisma();
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: 'up',
        latency_ms: Date.now() - startedAt
      };
    } catch (error: any) {
      return {
        status: 'down',
        latency_ms: Date.now() - startedAt,
        error: error?.message || 'Database connection error'
      };
    }
  },

  // 1. Users
  async getUsers(searchQuery?: string) {
    if (this.isDatabaseConfigured()) {
      try {
        const prisma = getPrisma();
        const users = await prisma.user.findMany({
          where: searchQuery
            ? {
                OR: [
                  { fullName: { contains: searchQuery, mode: 'insensitive' } },
                  { username: { contains: searchQuery, mode: 'insensitive' } }
                ]
              }
            : undefined
        });
        if (users.length > 0) return users;
      } catch (err) {
        console.warn('Prisma getUsers query fallback to memory:', err);
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return INITIAL_USERS.filter(
        (u) => u.fullName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
      );
    }
    return INITIAL_USERS;
  },

  async getUserByUsername(username: string) {
    const clean = username.replace('@', '').toLowerCase();
    if (this.isDatabaseConfigured()) {
      try {
        const prisma = getPrisma();
        const user = await prisma.user.findFirst({
          where: { username: { equals: clean, mode: 'insensitive' } }
        });
        if (user) return user;
      } catch (err) {
        console.warn('Prisma getUserByUsername query fallback:', err);
      }
    }
    return INITIAL_USERS.find((u) => u.username.toLowerCase() === clean) || null;
  },

  // 2. Posts
  async getFeedPosts() {
    if (this.isDatabaseConfigured()) {
      try {
        const prisma = getPrisma();
        const posts = await prisma.post.findMany({
          include: { author: true },
          orderBy: { createdAt: 'desc' },
          take: 20
        });
        if (posts.length > 0) {
          return posts.map((p) => ({
            id: p.id,
            caption: p.content,
            imageUrl: p.imageUrl || '',
            likesCount: p.likesCount,
            commentsCount: p.commentsCount,
            sharesCount: p.sharesCount,
            tags: p.tags,
            createdAt: p.createdAt.toISOString(),
            author: {
              id: p.author.id,
              username: p.author.username,
              fullName: p.author.fullName,
              avatar: p.author.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              verified: p.author.verified
            }
          }));
        }
      } catch (err) {
        console.warn('Prisma getFeedPosts query fallback:', err);
      }
    }
    return [
      {
        id: 'post_server_1',
        caption: 'डिजिटल भारत की नई क्रांति — BharatConnect पर आपका स्वागत है! 🇮🇳✨ #DigitalIndia #MakeInIndia',
        author: INITIAL_USERS[0],
        likesCount: 1420,
        commentsCount: 89,
        sharesCount: 230,
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        tags: ['DigitalIndia', 'BharatConnect']
      }
    ];
  },

  async createPost(data: { authorId?: string; caption: string; imageUrl?: string; tags?: string[]; isDilSe?: boolean }) {
    if (this.isDatabaseConfigured()) {
      try {
        const prisma = getPrisma();
        // Fallback user if none provided
        let authorId = data.authorId;
        if (!authorId) {
          const firstUser = await prisma.user.findFirst();
          authorId = firstUser ? firstUser.id : undefined;
        }
        if (authorId) {
          const created = await prisma.post.create({
            data: {
              authorId,
              content: data.caption,
              imageUrl: data.imageUrl,
              tags: data.tags || ['BharatConnect'],
              isDilSe: Boolean(data.isDilSe)
            }
          });
          return created;
        }
      } catch (err) {
        console.warn('Prisma createPost query fallback:', err);
      }
    }
    return {
      id: `post_${Date.now()}`,
      content: data.caption,
      imageUrl: data.imageUrl || '',
      tags: data.tags || ['BharatConnect'],
      createdAt: new Date()
    };
  },

  // 3. Groups
  async getGroups() {
    if (this.isDatabaseConfigured()) {
      try {
        const prisma = getPrisma();
        const groups = await prisma.group.findMany();
        if (groups.length > 0) return groups;
      } catch (err) {
        console.warn('Prisma getGroups query fallback:', err);
      }
    }
    return INITIAL_GROUPS;
  },

  // 4. Events
  async getEvents() {
    if (this.isDatabaseConfigured()) {
      try {
        const prisma = getPrisma();
        const events = await prisma.event.findMany();
        if (events.length > 0) return events;
      } catch (err) {
        console.warn('Prisma getEvents query fallback:', err);
      }
    }
    return INITIAL_EVENTS;
  },

  // 5. Products (Desi Haat)
  async getProducts() {
    if (this.isDatabaseConfigured()) {
      try {
        const prisma = getPrisma();
        const products = await prisma.product.findMany();
        if (products.length > 0) return products;
      } catch (err) {
        console.warn('Prisma getProducts query fallback:', err);
      }
    }
    return INITIAL_PRODUCTS;
  },

  // 6. Creator Analytics
  async getCreatorStats() {
    return INITIAL_CREATOR_STATS;
  },

  // 7. Google OAuth User Find/Create
  async findOrCreateGoogleUser(googleProfile: {
    email: string;
    name: string;
    picture?: string;
    sub: string;
  }) {
    if (this.isDatabaseConfigured()) {
      try {
        const prisma = getPrisma();
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: googleProfile.email },
              { uid: googleProfile.sub }
            ]
          }
        });

        if (!user) {
          const usernameBase = (googleProfile.email.split('@')[0] || 'citizen')
            .replace(/[^a-zA-Z0-9_]/g, '')
            .toLowerCase();
          const username = `${usernameBase}_${Math.floor(100 + Math.random() * 900)}`;

          user = await prisma.user.create({
            data: {
              uid: googleProfile.sub,
              email: googleProfile.email,
              fullName: googleProfile.name || 'Bharat Citizen',
              username,
              avatarUrl: googleProfile.picture || null,
              verified: true,
              accountType: 'Personal'
            }
          });
        }
        return user;
      } catch (err) {
        console.warn('Prisma findOrCreateGoogleUser error, falling back:', err);
      }
    }

    return {
      id: `user_google_${googleProfile.sub.slice(0, 10)}`,
      uid: googleProfile.sub,
      email: googleProfile.email,
      fullName: googleProfile.name || 'Bharat Citizen',
      username: (googleProfile.email.split('@')[0] || 'citizen').toLowerCase(),
      avatarUrl: googleProfile.picture || null,
      verified: true,
      accountType: 'Personal',
      createdAt: new Date().toISOString()
    };
  }
};

