import React, { useState } from 'react';
import { INITIAL_API_ENDPOINTS } from '../data/initialData';
import { ApiEndpoint } from '../types';
import { 
  Server, 
  Play, 
  Copy, 
  Check, 
  Code2, 
  FileCode, 
  CheckCircle2,
  Send
} from 'lucide-react';

export const NestJsApiView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(INITIAL_API_ENDPOINTS[0]);
  const [activeTab, setActiveTab] = useState<'tester' | 'code'>('tester');
  const [selectedCodeFile, setSelectedCodeFile] = useState<'auth.service' | 'app.module' | 'posts.service' | 'redis.service' | 'gifts.service'>('auth.service');
  const [customBody, setCustomBody] = useState<string>(selectedEndpoint.requestBody || '');
  const [executionResult, setExecutionResult] = useState<Record<string, unknown> | null>(selectedEndpoint.mockResponse);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setCustomBody(ep.requestBody || '');
    setExecutionResult(ep.mockResponse);
  };

  const handleExecuteRequest = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setExecutionResult(selectedEndpoint.mockResponse);
    }, 250);
  };

  const codeSnippets = {
    'auth.service': `import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface SignupDto {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    // Check if user exists
    const existing = await this.prisma.users.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] }
    });
    if (existing) throw new ConflictException('User already exists');

    // Hash password (bcrypt 12 salt rounds)
    const password_hash = await bcrypt.hash(dto.password, 12);

    // Create user in PostgreSQL
    const user = await this.prisma.users.create({
      data: {
        username: dto.username.toLowerCase(),
        email: dto.email.toLowerCase(),
        password_hash,
        full_name: dto.full_name,
      }
    });

    // Generate tokens
    const access_token = this.jwtService.sign(
      { sub: user.id, username: user.username },
      { expiresIn: '7d' }
    );

    return { user, access_token };
  }
}`,

    'app.module': `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { PostsModule } from './posts/posts.module';
import { MediaModule } from './media/media.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. PostgreSQL 15 Connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://bharat:bharat_pass_2026@postgres:5432/bharat_social',
      autoLoadEntities: true,
      synchronize: false, // Managed via init.sql / migrations
    }),

    // 2. Redis 7 BullMQ Queue & Cache
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),

    PostsModule,
    MediaModule,
    AuthModule,
  ],
})
export class AppModule {}`,

    'posts.service': `import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepo: Repository<PostEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getFeed(userId: string, page = 1) {
    const cacheKey = \`feed:user:\${userId}:page:\${page}\`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return { data: cached, source: 'redis_cache_hit' };

    const posts = await this.postsRepo.find({
      order: { createdAt: 'DESC' },
      take: 20,
      skip: (page - 1) * 20,
    });

    // Cache in Redis for 120 seconds
    await this.cacheManager.set(cacheKey, posts, 120);
    return { data: posts, source: 'postgres_db' };
  }
}`,

    'redis.service': `import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
  }

  async incrementTrending(tag: string, scoreDelta = 1) {
    // Increment sorted set in Redis
    return await this.client.zincrby('trending:hashtags', scoreDelta, tag);
  }

  async getTopTrends(limit = 10) {
    return await this.client.zrevrange('trending:hashtags', 0, limit - 1, 'WITHSCORES');
  }
}`,

    'gifts.service': `import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class GiftsService {
  constructor(private readonly dataSource: DataSource) {}

  async sendGift(senderId: string, receiverId: string, giftId: string, coinAmount: number) {
    // 70% Creator split in paise (1 coin = 100 paise = 1 INR)
    const totalPaise = coinAmount * 100;
    const creatorPaise = Math.round(totalPaise * 0.70);
    const platformPaise = totalPaise - creatorPaise;

    return await this.dataSource.transaction(async (manager) => {
      // 1. Record gift transaction
      const tx = await manager.query(
        \`INSERT INTO gift_transactions (sender_id, receiver_id, gift_id, coin_amount, creator_earning_paise, platform_commission_paise)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *\`,
        [senderId, receiverId, giftId, coinAmount, creatorPaise, platformPaise],
      );

      // 2. Increment creator earnings
      await manager.query(
        \`INSERT INTO creator_earnings (creator_id, total_earned_paise, available_balance_paise)
         VALUES ($1, $2, $2)
         ON CONFLICT (creator_id) 
         DO UPDATE SET 
           total_earned_paise = creator_earnings.total_earned_paise + EXCLUDED.total_earned_paise,
           available_balance_paise = creator_earnings.available_balance_paise + EXCLUDED.available_balance_paise\`,
        [receiverId, creatorPaise],
      );

      return { transactionId: tx[0].id, creatorPaise, platformPaise };
    });
  }

  async withdrawViaUPI(creatorId: string, amountPaise: number, upiId: string) {
    // 1% TDS under Section 194-O
    const tdsPaise = Math.round(amountPaise * 0.01);
    const netAmountPaise = amountPaise - tdsPaise;

    return await this.dataSource.transaction(async (manager) => {
      // Deduct balance and insert payout record
      await manager.query(
        \`UPDATE creator_earnings 
         SET available_balance_paise = available_balance_paise - $1,
             withdrawn_paise = withdrawn_paise + $1 
         WHERE creator_id = $2\`,
        [amountPaise, creatorId],
      );

      const payout = await manager.query(
        \`INSERT INTO withdrawals (creator_id, amount_paise, tds_paise, net_amount_paise, status, upi_id, razorpay_payout_id)
         VALUES ($1, $2, $3, $4, 'completed', $5, $6) RETURNING *\`,
        [creatorId, amountPaise, tdsPaise, netAmountPaise, upiId, 'pout_RZP' + Date.now()],
      );

      return payout[0];
    });
  }
}`
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <Server className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">NestJS Backend Framework</h2>
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Target Port: 3000
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Depends on: [postgres :5432, redis :6379, minio :9000]
            </p>
          </div>
        </div>

        {/* Segmented Tab */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('tester')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tester'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Endpoint Sandbox</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>NestJS Starter Code</span>
          </button>
        </div>
      </div>

      {activeTab === 'tester' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Endpoints Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">
              Endpoints Catalog ({INITIAL_API_ENDPOINTS.length})
            </p>
            {INITIAL_API_ENDPOINTS.map((ep) => {
              const isSelected = ep.path === selectedEndpoint.path && ep.method === selectedEndpoint.method;
              const isPost = ep.method === 'POST';
              return (
                <div
                  key={`${ep.method}-${ep.path}`}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-rose-500/50 shadow-sm'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isPost ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs text-white truncate font-medium">
                      {ep.path}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ep.summary}</p>
                </div>
              );
            })}
          </div>

          {/* Sandbox & Response Viewer (8 cols) */}
          <div className="lg:col-span-8 p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/20 text-blue-400">
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono text-sm font-bold text-white">
                  {selectedEndpoint.path}
                </span>
              </div>
              <button
                onClick={handleExecuteRequest}
                disabled={isExecuting}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isExecuting ? 'Sending...' : 'Test Request'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300">{selectedEndpoint.summary}</p>

            {/* Request Body Editor if POST */}
            {selectedEndpoint.method === 'POST' && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Request Body (JSON)</label>
                <textarea
                  rows={4}
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  className="w-full p-3 bg-slate-950 font-mono text-xs rounded-xl border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500/60"
                />
              </div>
            )}

            {/* Execution Response */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">HTTP Response</span>
                <span className="text-emerald-400 font-bold">200 OK · 1.8ms</span>
              </div>
              <pre className="p-4 bg-slate-950 font-mono text-xs rounded-xl border border-slate-800 text-emerald-300 overflow-x-auto max-h-72 leading-relaxed">
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* View 2: NestJS Code Generator */
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-rose-400" />
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setSelectedCodeFile('auth.service')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    selectedCodeFile === 'auth.service' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  src/auth/auth.service.ts
                </button>
                <button
                  onClick={() => setSelectedCodeFile('app.module')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    selectedCodeFile === 'app.module' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  src/app.module.ts
                </button>
                <button
                  onClick={() => setSelectedCodeFile('posts.service')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    selectedCodeFile === 'posts.service' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  src/posts/posts.service.ts
                </button>
                <button
                  onClick={() => setSelectedCodeFile('redis.service')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    selectedCodeFile === 'redis.service' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  src/redis/redis.service.ts
                </button>
                <button
                  onClick={() => setSelectedCodeFile('gifts.service')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    selectedCodeFile === 'gifts.service' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  src/gifts/gifts.service.ts
                </button>
              </div>
            </div>

            <button
              onClick={() => handleCopyCode(codeSnippets[selectedCodeFile])}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 font-mono text-xs rounded-xl border border-slate-800 text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed">
            {codeSnippets[selectedCodeFile]}
          </pre>
        </div>
      )}
    </div>
  );
};
