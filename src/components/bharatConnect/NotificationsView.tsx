import React, { useState } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { Heart, MessageCircle, UserPlus, Bell, CheckCheck, Sparkles } from 'lucide-react';
import { AppNotification } from '../../types/bharatConnect';

export const NotificationsView: React.FC = () => {
  const { notifications, t, currentUser, setToastMessage } = useBharatConnect();
  const [localNotifications, setLocalNotifications] = useState<AppNotification[]>(notifications);

  const markAllRead = () => {
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setToastMessage('सभी सूचनाएं पढ़ी गईं (All marked as read)');
  };

  const addSimulatedNotification = () => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      type: 'like',
      actor: {
        id: 'u_sim',
        username: 'ananya_pandey',
        fullName: 'Ananya Pandey',
        handle: '@ananya_p',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        bio: 'Artist & Creator',
        location: 'Mumbai',
        verified: true,
        followersCount: 15400,
        followingCount: 320,
        postCount: 88,
        language: 'hi'
      },
      postPreview: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=150&auto=format&fit=crop&q=80',
      timeAgo: 'Just now',
      isRead: false
    };
    setLocalNotifications((prev) => [newNotif, ...prev]);
    setToastMessage('नई सूचना प्राप्त हुई! (New notification received)');
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-orange-400" />;
    }
  };

  const getMessage = (n: AppNotification) => {
    switch (n.type) {
      case 'like':
        return 'ने आपकी पोस्ट को लाइक किया';
      case 'comment':
        return 'ने आपकी पोस्ट पर टिप्पणी की';
      case 'follow':
        return 'ने आपको फ़ॉलो करना शुरू किया';
      default:
        return 'ने आपको मेंशन किया';
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" />
            {t.notifications}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            आपकी पोस्ट्स और फ़ॉलोअर्स की नवीनतम गतिविधि
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={addSimulatedNotification}
            className="p-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs flex items-center gap-1 transition"
            title="टेस्ट सूचना भेजें"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">टेस्ट अलर्ट</span>
          </button>
          <button
            onClick={markAllRead}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
            title="Mark all as read"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">सब पढ़ें</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {localNotifications.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <Bell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-400">{t.noNotifications}</p>
          <p className="text-xs text-slate-500 mt-1">जब कोई आपकी पोस्ट को लाइक या फ़ॉलो करेगा, यहां दिखेगा।</p>
        </div>
      ) : (
        <div className="space-y-2">
          {localNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                notif.isRead
                  ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                  : 'bg-slate-900/90 border-orange-500/30 text-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar with type badge */}
                <div className="relative">
                  <img
                    src={notif.actor.avatar}
                    alt={notif.actor.fullName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-700"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-sm">
                    {getIcon(notif.type)}
                  </div>
                </div>

                {/* Content text */}
                <div className="text-xs leading-relaxed">
                  <span className="font-semibold text-white mr-1">
                    {notif.actor.fullName}
                  </span>
                  <span>{getMessage(notif)}</span>
                  <div className="text-[11px] text-slate-500 mt-0.5">{notif.timeAgo}</div>
                </div>
              </div>

              {/* Right side thumbnail preview or follow button */}
              {notif.postPreview ? (
                <img
                  src={notif.postPreview}
                  alt="Post preview"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-800 shrink-0"
                />
              ) : notif.type === 'follow' ? (
                <button className="px-3 py-1 rounded-full bg-orange-500 text-white text-[11px] font-semibold shrink-0">
                  फ़ॉलो बैक
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
