import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, Radio, Sparkles, Clock, CheckCircle2, Heart, MessageSquare, Share2 } from 'lucide-react';

export interface RealTimePost {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  likesCount?: number;
  location?: string;
  tags?: string[];
}

interface FeedComponentProps {
  currentUserId?: string;
}

export const FeedComponent: React.FC<FeedComponentProps> = ({ 
  currentUserId = 'as9621302122' 
}) => {
  const [posts, setPosts] = useState<RealTimePost[]>([]);
  const [newContent, setNewContent] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [livePingsCount, setLivePingsCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to WebSocket dynamically using current window origin or fallback
    const serverUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      // सर्वर से जुड़कर अपना फीड रूम ज्वाइन करें
      socket.emit('join_feed', currentUserId);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Initial feed payload if available
    socket.on('initial_feed', (initialPosts: RealTimePost[]) => {
      if (Array.isArray(initialPosts) && initialPosts.length > 0) {
        setPosts((prev) => {
          const ids = new Set(prev.map(p => p.id));
          const newEntries = initialPosts.filter(p => !ids.has(p.id));
          return [...prev, ...newEntries];
        });
      }
    });

    // रियल-टाइम इवेंट सुनें: जैसे ही सर्वर नया पोस्ट भेजे, बिना पेज रीलोड किए स्टेट अपडेट करें
    socket.on('new_post_event', (incomingPost: RealTimePost) => {
      setLivePingsCount((c) => c + 1);
      setPosts((prevPosts) => {
        // Idempotency check: duplicate prevention
        if (prevPosts.some((p) => p.id === incomingPost.id)) {
          return prevPosts;
        }
        return [incomingPost, ...prevPosts]; // नया पोस्ट सबसे ऊपर जोड़ें
      });
    });

    // Fetch any existing posts on initial load
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        if (data?.posts && Array.isArray(data.posts)) {
          setPosts(prev => {
            const ids = new Set(prev.map(p => p.id));
            const fresh = data.posts.filter((p: RealTimePost) => !ids.has(p.id));
            return [...prev, ...fresh];
          });
        }
      })
      .catch(() => {});

    // Cleanup on unmount
    return () => {
      socket.off('new_post_event');
      socket.off('initial_feed');
      socket.disconnect();
    };
  }, [currentUserId]);

  // Publish new post to /api/posts to trigger WebSocket broadcast
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setIsPublishing(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          username: currentUserId,
          content: newContent.trim()
        })
      });

      if (res.ok) {
        setNewContent('');
      } else {
        const data = await res.json();
        console.error('Publish error:', data.error);
      }
    } catch (err) {
      console.error('Publish request failed:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-zinc-950 text-zinc-100 rounded-2xl border border-zinc-800 shadow-2xl p-4 my-4 font-sans">
      
      {/* Real-time Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
          <h2 className="text-base font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-1.5">
            Live Real-Time Feed 🚀
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
            isConnected 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
          }`}>
            <Radio size={12} className={isConnected ? "animate-spin" : ""} />
            {isConnected ? 'WebSocket कनेक्टेड' : 'कनेक्ट हो रहा है...'}
          </span>
          {livePingsCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 bg-orange-600 text-white rounded-md font-bold animate-bounce">
              +{livePingsCount} नया
            </span>
          )}
        </div>
      </div>

      {/* Post Creator Box */}
      <form onSubmit={handlePublish} className="mb-4 bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-inner">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="लाइव फीड में तुरंत पोस्ट करें (बिना रीलोड सभी को दिखेगा)..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 resize-none h-20 mb-2"
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            आईडी: <strong className="text-zinc-400">@{currentUserId}</strong>
          </span>
          <button
            type="submit"
            disabled={isPublishing || !newContent.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-bold rounded-lg text-xs shadow-md transition disabled:opacity-50 cursor-pointer active:scale-95"
          >
            <Send size={14} />
            <span>{isPublishing ? 'पब्लिश हो रहा...' : 'लाइव भेजें'}</span>
          </button>
        </div>
      </form>

      {/* Feed List */}
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="text-center py-8 bg-zinc-900/50 rounded-xl border border-zinc-800/80">
            <Radio size={32} className="mx-auto text-zinc-600 mb-2 animate-pulse" />
            <p className="text-xs text-zinc-400">कोई लाइव पोस्ट अभी उपलब्ध नहीं है।</p>
            <p className="text-[11px] text-zinc-500 mt-1">ऊपर नया विचार लिखकर 'लाइव भेजें' दबाएं!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 rounded-xl p-3.5 transition-all shadow-sm animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 p-[1.5px]">
                    <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center text-xs font-bold text-amber-400">
                      {post.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-zinc-100">@{post.username}</span>
                      <CheckCircle2 size={12} className="text-blue-400" />
                    </div>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-md font-mono border border-amber-500/20">
                  Live WS
                </span>
              </div>

              <p className="text-xs text-zinc-200 leading-relaxed pl-1 mb-3">
                {post.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-400">
                <button className="flex items-center gap-1 hover:text-red-400 transition cursor-pointer">
                  <Heart size={14} />
                  <span>{post.likesCount || 0}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-amber-400 transition cursor-pointer">
                  <MessageSquare size={14} />
                  <span>टिप्पणी</span>
                </button>
                <button 
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(`${post.username}: ${post.content}`);
                    }
                  }} 
                  className="flex items-center gap-1 hover:text-emerald-400 transition cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>शेयर</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedComponent;
