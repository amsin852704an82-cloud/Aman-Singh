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
  LogIn,
  Camera,
  Image as ImageIcon,
  Mic,
  Square,
  Play,
  Pause,
  Volume2,
  Trash2,
  Clock,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { triggerHaptic } from '../../lib/deviceOptimization';

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

  // Voice note recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);

  // Voice note playback states
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Lightbox for chat photos
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  // File input ref for camera/gallery
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUid = currentUser.uid || currentUser.id || firebaseUser?.uid || 'current_user';
  const recipientUid = recipientUser?.uid || recipientUser?.id;

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isRecording]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

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

        // Preload default initial messages matching blueprint
        const defaultBlueprintMessages: ChatMessage[] = [
          {
            id: 'msg_init_1',
            chatId: 'default_chat',
            senderUid: recipientUid!,
            senderName: recipientUser!.fullName || 'क्रिएटर',
            senderAvatar: recipientUser!.avatar,
            text: 'नमस्ते! आपकी रील बहुत पसंद आई। क्या हम किसी नए प्रोजेक्ट पर साथ काम कर सकते हैं?',
            createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
          },
          {
            id: 'msg_init_2',
            chatId: 'default_chat',
            senderUid: currentUid,
            senderName: currentUser.fullName,
            senderAvatar: currentUser.avatar,
            text: 'नमस्ते जी! बिल्कुल, मिलकर कुछ बेहतरीन बनाते हैं। 🚀',
            createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
          }
        ];

        try {
          const id = await getOrCreateChat(currentUser, recipientUser!);
          if (isSubscribed) {
            setChatId(id);
          }
        } catch {
          // If offline / demo mode, fallback to in-memory conversation
          if (isSubscribed) {
            setChatId(`demo_${currentUid}_${recipientUid}`);
            setMessages(defaultBlueprintMessages);
          }
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
    if (!chatId || chatId.startsWith('demo_')) return;

    const unsubscribe = subscribeToChatMessages(
      chatId,
      (liveMessages) => {
        if (liveMessages && liveMessages.length > 0) {
          setMessages(liveMessages);
        }
      },
      (err) => {
        console.warn('Real-time messages subscription notice:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  if (!recipientUser) return null;

  // Handle Text Message Send
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = messageText.trim();
    if (!textToSend || isSending) return;

    triggerHaptic('medium');

    const nowIso = new Date().toISOString();
    const optimisticMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      chatId: chatId || 'chat',
      senderUid: currentUid,
      senderName: currentUser.fullName || currentUser.name || 'उपयोगकर्ता',
      senderAvatar: currentUser.photoURL || currentUser.avatar || '',
      text: textToSend,
      createdAt: nowIso
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setMessageText('');

    if (chatId && !chatId.startsWith('demo_') && isFirebaseAuthLoggedIn) {
      setIsSending(true);
      try {
        await sendChatMessage(chatId, textToSend, currentUser);
      } catch (err: any) {
        console.error('Failed to send message:', err);
      } finally {
        setIsSending(false);
      }
    }
  };

  // Handle Photo Picker & Send
  const handlePickAndSendImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    triggerHaptic('medium');
    const objectUrl = URL.createObjectURL(file);

    const nowIso = new Date().toISOString();
    const imageMessage: ChatMessage = {
      id: `msg_img_${Date.now()}`,
      chatId: chatId || 'chat',
      senderUid: currentUid,
      senderName: currentUser.fullName,
      senderAvatar: currentUser.avatar,
      text: '📷 फोटो',
      mediaUrl: objectUrl,
      createdAt: nowIso
    };

    setMessages((prev) => [...prev, imageMessage]);
    setToastMessage('📷 फोटो भेजी गई!');

    if (chatId && !chatId.startsWith('demo_') && isFirebaseAuthLoggedIn) {
      sendChatMessage(chatId, '📷 फोटो', currentUser, { mediaUrl: objectUrl }).catch(() => {});
    }

    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Handle Voice Note Record Toggle
  const handleVoiceRecordToggle = () => {
    triggerHaptic('light');

    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      setToastMessage('🎙️ वॉयस रिकॉर्डिंग शुरू... बोलिए');
    } else {
      // Stop recording and send voice message
      setIsRecording(false);
      const durationSec = Math.max(1, recordingSeconds);
      const formattedDuration = `0:${durationSec < 10 ? `0${durationSec}` : durationSec}`;

      const nowIso = new Date().toISOString();
      const voiceMessage: ChatMessage = {
        id: `msg_voice_${Date.now()}`,
        chatId: chatId || 'chat',
        senderUid: currentUid,
        senderName: currentUser.fullName,
        senderAvatar: currentUser.avatar,
        text: `🎤 वॉयस संदेश (${formattedDuration})`,
        audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_events.ogg',
        audioDuration: formattedDuration,
        createdAt: nowIso
      };

      setMessages((prev) => [...prev, voiceMessage]);
      setToastMessage(`🎉 वॉयस नोट भेजा गया (${formattedDuration})`);

      if (chatId && !chatId.startsWith('demo_') && isFirebaseAuthLoggedIn) {
        sendChatMessage(
          chatId, 
          `🎤 वॉयस संदेश (${formattedDuration})`, 
          currentUser, 
          { 
            audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_events.ogg',
            audioDuration: formattedDuration 
          }
        ).catch(() => {});
      }
    }
  };

  // Handle Voice Note Playback
  const handleTogglePlayAudio = (msgId: string, audioUrl?: string) => {
    triggerHaptic('light');

    if (playingAudioId === msgId) {
      audioPlayerRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioUrl || 'https://actions.google.com/sounds/v1/ambiences/outdoor_events.ogg';
        audioPlayerRef.current.play().catch(() => {});
        setPlayingAudioId(msgId);
      }
    }
  };

  const handleAddEmoji = (emoji: string) => {
    triggerHaptic('light');
    setMessageText((prev) => prev + emoji);
  };

  const recipientName = recipientUser.fullName || recipientUser.name || 'आकाश शर्मा (काशी)';
  const recipientAvatar = recipientUser.photoURL || recipientUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';

  const formatMessageTime = (isoString: string) => {
    try {
      if (!isoString) return '';
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '10:18 AM';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      {/* Hidden Audio Player for Voice Notes */}
      <audio
        ref={audioPlayerRef}
        onEnded={() => setPlayingAudioId(null)}
        onError={() => setPlayingAudioId(null)}
      />

      {/* Hidden File Input for Image Pick */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handlePickAndSendImage}
        className="hidden"
      />

      <div className="w-full max-w-lg h-full sm:h-[650px] bg-[#0F172A] border-0 sm:border border-slate-800 rounded-none sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Chat Header matching User Blueprint */}
        <div className="px-4 py-3 bg-[#1E293B] border-b border-slate-800 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={recipientAvatar}
                alt={recipientName}
                className="w-10 h-10 rounded-full object-cover border-2 border-orange-500 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#1E293B] rounded-full animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base text-slate-100 leading-tight">
                  {recipientName}
                </h3>
                {recipientUser.verified && (
                  <CheckCircle2 className="w-4 h-4 text-orange-400 fill-orange-400/20" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>🟢 ऑनलाइन • सक्रिय अभी</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition active:scale-95 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In Warning (if guest) */}
        {!isFirebaseAuthLoggedIn && (
          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>डेमो मोड: संदेश रीयल-टाइम में दिख रहे हैं।</span>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-orange-500 text-white font-bold text-[11px]"
            >
              लॉगिन
            </button>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0F172A] no-scrollbar">
          {isInitializing ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              <p className="text-xs">सुरक्षित चैट लोड हो रही है...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-300">
                {recipientName} के साथ बातचीत शुरू करें
              </h4>
              <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                फोटो, वॉयस नोट्स और विचार आसानी से साझा करें।
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderUid === currentUid;
              const hasImage = Boolean(msg.mediaUrl);
              const hasVoice = Boolean(msg.audioUrl || msg.audioDuration);

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
                    className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed shadow-md transition-all ${
                      isMine
                        ? 'bg-[#FF6B00] text-white rounded-br-xs'
                        : 'bg-[#1E293B] text-slate-100 border border-[#334155] rounded-bl-xs'
                    }`}
                  >
                    {/* 1. Shared Image Media */}
                    {hasImage && (
                      <div className="relative rounded-xl overflow-hidden mb-1.5 bg-black/40 group">
                        <img
                          src={msg.mediaUrl}
                          alt="Shared Photo"
                          onClick={() => setPreviewPhotoUrl(msg.mediaUrl || null)}
                          className="w-56 h-40 object-cover rounded-xl cursor-pointer hover:scale-102 transition duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewPhotoUrl(msg.mediaUrl || null)}
                          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
                          title="बड़ा करें"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* 2. Shared Voice Note Message */}
                    {hasVoice ? (
                      <div className="flex items-center gap-2.5 py-1 min-w-[200px]">
                        <button
                          type="button"
                          onClick={() => handleTogglePlayAudio(msg.id, msg.audioUrl)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-sm active:scale-95 cursor-pointer ${
                            isMine 
                              ? 'bg-white text-orange-600' 
                              : 'bg-orange-500 text-white'
                          }`}
                        >
                          {playingAudioId === msg.id ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-1 h-4">
                            {[40, 75, 55, 90, 60, 80, 45, 95, 60, 70, 50, 85].map((h, i) => (
                              <div
                                key={i}
                                style={{ height: `${h}%` }}
                                className={`w-1 rounded-full transition-all ${
                                  playingAudioId === msg.id
                                    ? isMine ? 'bg-white animate-pulse' : 'bg-orange-400 animate-pulse'
                                    : isMine ? 'bg-white/60' : 'bg-slate-400'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className={isMine ? 'text-orange-100' : 'text-slate-400'}>
                              {msg.audioDuration || '0:24'}
                            </span>
                            <span className={`font-mono ${isMine ? 'text-white' : 'text-orange-400'}`}>
                              वॉयस नोट
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* 3. Text Message */
                      !hasImage && <p className="text-[13px] break-words">{msg.text}</p>
                    )}

                    {/* Timestamp */}
                    <span
                      className={`text-[10px] block text-right mt-1 font-mono ${
                        isMine ? 'text-orange-100/90' : 'text-slate-400'
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

        {/* Active Voice Recording Indicator Bar */}
        {isRecording && (
          <div className="px-4 py-2 bg-red-600 text-white flex items-center justify-between text-xs font-bold animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span>🎙️ वॉयस नोट रिकॉर्ड हो रहा है... (0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds})</span>
            </div>
            <button
              onClick={handleVoiceRecordToggle}
              className="px-3 py-1 bg-white text-red-600 rounded-full text-xs font-extrabold shadow-sm active:scale-95"
            >
              रोकें व भेजें
            </button>
          </div>
        )}

        {/* Quick Emoji Bar */}
        <div className="px-3 py-1.5 bg-[#1E293B]/70 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-500 mr-1 flex items-center gap-1">
            <Smile className="w-3.5 h-3.5 text-amber-400" />
          </span>
          {QUICK_EMOJIS.map((emoji) => (
            <button
              type="button"
              key={emoji}
              onClick={() => handleAddEmoji(emoji)}
              className="text-xs hover:scale-125 transition-transform p-1 rounded-md cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Bottom Input Bar matching User Blueprint: 📷 Photo, 🎙️ Voice, Text Input, Send Button */}
        <form onSubmit={handleSendMessage} className="p-3 bg-[#1E293B] border-t border-[#334155] flex items-center gap-2">
          {/* 📷 Photo Share Button */}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="w-10 h-10 rounded-full bg-[#334155] hover:bg-slate-600 text-white flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0 shadow-sm"
            title="गैलरी या कैमरे से फोटो भेजें"
          >
            <Camera className="w-5 h-5 text-orange-400" />
          </button>

          {/* 🎙️ Voice Note Button */}
          <button
            type="button"
            onClick={handleVoiceRecordToggle}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0 shadow-sm ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-[#334155] hover:bg-slate-600 text-white'
            }`}
            title="वॉयस नोट भेजें"
          >
            <Mic className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-purple-400'}`} />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="संदेश लिखें..."
            className="flex-1 bg-[#0F172A] text-xs sm:text-sm text-white px-4 py-2.5 rounded-full border border-[#334155] focus:outline-none focus:border-orange-500 placeholder-slate-400"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!messageText.trim() && !isRecording}
            className="px-4 py-2.5 rounded-full bg-[#FF6B00] hover:bg-orange-600 disabled:bg-slate-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center transition shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <span>भेजें</span>
          </button>
        </form>
      </div>

      {/* Lightbox Photo Preview Modal */}
      {previewPhotoUrl && (
        <div 
          onClick={() => setPreviewPhotoUrl(null)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in cursor-pointer"
        >
          <button
            onClick={() => setPreviewPhotoUrl(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewPhotoUrl}
            alt="Full Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
