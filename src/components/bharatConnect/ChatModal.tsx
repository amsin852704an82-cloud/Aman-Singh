import React, { useState, useEffect, useRef } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { User, ChatMessage } from '../../types/bharatConnect';
import { 
  getOrCreateChat, 
  sendChatMessage, 
  subscribeToChatMessages 
} from '../../lib/chatService';
import { 
  X, 
  Send, 
  MessageCircle, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Smile, 
  Radio, 
  LogIn 
} from 'lucide-react';

interface ChatModalProps {
  recipientUser: User | null;
  onClose: () => void;
  initialMessage?: string;
}

const QUICK_EMOJIS = ['🙏', '🇮🇳', '✨', '❤️', '👍', '☕', '🌸', '🪔'];

export const ChatModal: React.FC<ChatModalProps> = ({ recipientUser, onClose, initialMessage }) => {
  const { 
    currentUser, 
    firebaseUser, 
    isFirebaseAuthLoggedIn, 
    setIsAuthModalOpen, 
    setToastMessage 
  } = useBharatConnect();

  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState(initialMessage || '');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUid = currentUser.uid || currentUser.id || firebaseUser?.uid;
  const recipientUid = recipientUser?.uid || recipientUser?.id;

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize or fetch conversation
  useEffect(() => {
    if (!recipientUser || !currentUid || !recipientUid) {
      setIsInitializing(false);
      return;
    }

    let isSubscribed = true;

    async function initChat() {
      try {
        setIsInitializing(true);
        setErrorMessage(null);
        const id = await getOrCreateChat(currentUser, recipientUser!);
        if (isSubscribed) {
          setChatId(id);
        }
      } catch (err: any) {
        console.error('Error initializing chat:', err);
        if (isSubscribed) {
          setErrorMessage(err?.message || 'चैट शुरू करने में समस्या आई।');
        }
      } finally {
        if (isSubscribed) {
          setIsInitializing(false);
        }
      }
    }

    initChat();

    return () => {
      isSubscribed = false;
    };
  }, [currentUid, recipientUid]);

  // Subscribe to real-time messages when chatId is ready
  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = subscribeToChatMessages(
      chatId,
      (liveMessages) => {
        setMessages(liveMessages);
      },
      (err) => {
        console.warn('Real-time messages subscription error:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  if (!recipientUser) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = messageText.trim();
    if (!textToSend || !chatId || isSending) return;

    if (!isFirebaseAuthLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    // Optimistic UI append
    const optimisticMessage: ChatMessage = {
      id: `temp_${Date.now()}`,
      chatId,
      senderUid: currentUid || 'user',
      senderName: currentUser.fullName || currentUser.name || 'उपयोगकर्ता',
      senderAvatar: currentUser.photoURL || currentUser.avatar || '',
      text: textToSend,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setMessageText('');
    setIsSending(true);

    try {
      await sendChatMessage(chatId, textToSend, currentUser);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setErrorMessage(err?.message || 'संदेश भेजने में त्रुटि हुई।');
    } finally {
      setIsSending(false);
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
  };

  const recipientName = recipientUser.fullName || recipientUser.name || 'क्रिएटर';
  const recipientAvatar = recipientUser.photoURL || recipientUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

  const formatMessageTime = (isoString: string) => {
    try {
      if (!isoString) return '';
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg h-full sm:h-[620px] bg-slate-900 border-0 sm:border border-slate-800 rounded-none sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-3.5 sm:p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={recipientAvatar}
                alt={recipientName}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white leading-tight">
                  {recipientName}
                </h3>
                {recipientUser.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>{recipientUser.handle}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  रीयल-टाइम चैट
                </span>
              </div>
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

        {/* Not Logged In Warning */}
        {!isFirebaseAuthLoggedIn && (
          <div className="p-3 bg-amber-500/10 border-b border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>संदेश भेजने के लिए लॉगिन करें।</span>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-orange-500 text-white font-bold text-xs"
            >
              लॉगिन
            </button>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-2.5 bg-rose-500/10 border-b border-rose-500/30 text-rose-200 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-xs font-bold text-rose-400">×</button>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/60">
          {isInitializing ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
              <p className="text-xs">सुरक्षित बातचीत खोली जा रही है...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-300">
                {recipientName} के साथ चैट शुरू करें
              </h4>
              <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                यह बातचीत एंड-टू-एंड Firestore में रीयल-टाइम में सिंक होती है।
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderUid === currentUid;
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMine && (
                    <img
                      src={recipientAvatar}
                      alt={recipientName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-700 mb-1"
                    />
                  )}

                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                      isMine
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-xs'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-xs'
                    }`}
                  >
                    <p className="break-words">{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1 font-mono ${
                        isMine ? 'text-orange-100/80' : 'text-slate-400'
                      }`}
                    >
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Emoji Bar */}
        <div className="px-3 py-1.5 bg-slate-950/70 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-500 mr-1 flex items-center gap-1">
            <Smile className="w-3 h-3" />
          </span>
          {QUICK_EMOJIS.map((emoji) => (
            <button
              type="button"
              key={emoji}
              onClick={() => handleAddEmoji(emoji)}
              className="text-xs hover:scale-125 transition-transform p-1 rounded-md"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Message Input Footer */}
        <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={isFirebaseAuthLoggedIn ? `${recipientName} को संदेश लिखें...` : 'संदेश भेजने के लिए लॉगिन करें...'}
            disabled={!isFirebaseAuthLoggedIn || isSending}
            className="flex-1 bg-slate-900 text-xs text-slate-200 px-3.5 py-2.5 rounded-full border border-slate-800 focus:outline-none focus:border-orange-500 placeholder-slate-500"
            autoFocus
          />
          <button
            type="submit"
            disabled={!messageText.trim() || !isFirebaseAuthLoggedIn || isSending}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 disabled:from-slate-800 disabled:to-slate-800 text-white disabled:text-slate-600 flex items-center justify-center transition shadow-md active:scale-95 cursor-pointer shrink-0"
            title="संदेश भेजें"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Send className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
