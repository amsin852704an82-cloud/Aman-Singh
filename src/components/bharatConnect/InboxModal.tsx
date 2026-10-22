import React, { useState, useEffect } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { User, ChatConversation } from '../../types/bharatConnect';
import { subscribeToUserChats } from '../../lib/chatService';
import { ChatModal } from './ChatModal';
import { 
  X, 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  LogIn, 
  Sparkles, 
  Clock, 
  Radio 
} from 'lucide-react';

interface InboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InboxModal: React.FC<InboxModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    users, 
    firebaseUser, 
    isFirebaseAuthLoggedIn, 
    setIsAuthModalOpen 
  } = useBharatConnect();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentUid = currentUser.uid || currentUser.id || firebaseUser?.uid;

  // Real-time user conversations subscription
  useEffect(() => {
    if (!currentUid || !isOpen) return;

    const unsubscribe = subscribeToUserChats(
      currentUid,
      (liveChats) => {
        setConversations(liveChats);
      },
      (err) => {
        console.warn('Live chats subscription note:', err);
      }
    );

    return () => unsubscribe();
  }, [currentUid, isOpen]);

  if (!isOpen) return null;

  // Suggested creators to message
  const otherUsers = users.filter((u) => {
    const uUid = u.uid || u.id;
    return uUid !== currentUid;
  });

  const filteredUsers = otherUsers.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.fullName || '').toLowerCase().includes(q) ||
      (u.name || '').toLowerCase().includes(q) ||
      (u.handle || '').toLowerCase().includes(q)
    );
  });

  const handleStartChatWithUser = (u: User) => {
    setSelectedRecipient(u);
  };

  const formatChatTime = (isoString?: string) => {
    try {
      if (!isoString) return '';
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>संदेश (Direct Messages)</span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                    लाइव
                  </span>
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Login Banner if guest */}
          {!isFirebaseAuthLoggedIn && (
            <div className="p-3 bg-amber-500/10 border-b border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
              <span>संदेश भेजने के लिए लॉगिन करें।</span>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-1 rounded-lg bg-orange-500 text-white font-bold text-xs"
              >
                लॉगिन
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/60">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="क्रिएटर खोजें (Search creator to message)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Conversations or Suggested Users List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Active Conversations Section */}
            {conversations.length > 0 && !searchQuery.trim() && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  हालिया बातचीत ({conversations.length})
                </span>
                <div className="space-y-1.5">
                  {conversations.map((chat) => {
                    const otherUid = chat.participants.find((p) => p !== currentUid) || '';
                    const profile = chat.participantProfiles?.[otherUid];
                    const matchedUser = otherUsers.find((u) => (u.uid || u.id) === otherUid);

                    const targetUser: User = matchedUser || {
                      id: otherUid,
                      uid: otherUid,
                      fullName: profile?.name || 'क्रिएटर',
                      name: profile?.name || 'क्रिएटर',
                      username: (profile?.handle || '@creator').replace('@', ''),
                      handle: profile?.handle || '@creator',
                      avatar: profile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
                      photoURL: profile?.avatar || '',
                      bio: '',
                      location: 'भारत',
                      verified: false,
                      followersCount: 0,
                      followingCount: 0,
                      postCount: 0,
                      language: 'hi'
                    };

                    return (
                      <div
                        key={chat.chatId}
                        onClick={() => handleStartChatWithUser(targetUser)}
                        className="p-2.5 rounded-2xl bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800 transition flex items-center justify-between gap-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={targetUser.photoURL || targetUser.avatar}
                            alt={targetUser.fullName || targetUser.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-white truncate">
                                {targetUser.fullName || targetUser.name}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {chat.lastMessage || 'बातचीत शुरू हुई'}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          {formatChatTime(chat.lastMessageTimestamp || chat.updatedAt)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Creators Directory Section */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider px-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>क्रिएटर्स (Tap to chat)</span>
              </span>

              <div className="space-y-1.5">
                {filteredUsers.map((u) => {
                  const uName = u.fullName || u.name;
                  const uAvatar = u.photoURL || u.avatar;
                  return (
                    <div
                      key={u.id || u.uid}
                      onClick={() => handleStartChatWithUser(u)}
                      className="p-2.5 rounded-2xl bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800/80 transition flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={uAvatar}
                          alt={uName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs text-white truncate group-hover:text-orange-400 transition">
                              {uName}
                            </span>
                            {u.verified && (
                              <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400/20 shrink-0" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 truncate block">
                            {u.handle} · {u.location || 'भारत'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-3 py-1 rounded-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[11px] font-semibold transition shrink-0"
                      >
                        मैसेज
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active 1-on-1 Chat Modal */}
      {selectedRecipient && (
        <ChatModal
          recipientUser={selectedRecipient}
          onClose={() => setSelectedRecipient(null)}
        />
      )}
    </>
  );
};
