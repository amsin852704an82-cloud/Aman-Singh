import React, { useState } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Bell, 
  CheckCheck, 
  Check,
  Sparkles, 
  Trash2, 
  Eye, 
  EyeOff, 
  Loader2, 
  LogIn, 
  Radio, 
  ExternalLink 
} from 'lucide-react';
import { AppNotification } from '../../types/bharatConnect';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    unreadNotificationsCount,
    isNotificationsLoading,
    markNotificationRead,
    markNotificationUnread,
    markAllNotificationsRead,
    deleteNotificationItem,
    t, 
    currentUser, 
    firebaseUser,
    isFirebaseAuthLoggedIn,
    setIsAuthModalOpen,
    openUserProfile,
    toggleFollowUser,
    followingIds,
    setActiveTab,
    setToastMessage 
  } = useBharatConnect();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Filter items
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  // Separate into unread and read lists for clear sectioning
  const unreadItems = notifications.filter((n) => !n.isRead);
  const readItems = notifications.filter((n) => n.isRead);

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

  const getNotificationText = (notif: AppNotification) => {
    if (notif.message) return notif.message;
    switch (notif.type) {
      case 'like':
        return 'ने आपकी पोस्ट को लाइक किया';
      case 'comment':
        return 'ने आपकी पोस्ट पर टिप्पणी की';
      case 'follow':
        return 'ने आपको फ़ॉलो करना शुरू किया';
      default:
        return 'ने आपको सूचना भेजी';
    }
  };

  const handleCardClick = (notif: AppNotification) => {
    const notifId = notif.notificationId || notif.id;
    if (!notif.isRead && notifId) {
      markNotificationRead(notifId);
    }
  };

  const handleFollowBack = (notif: AppNotification, e: React.MouseEvent) => {
    e.stopPropagation();
    const senderUid = notif.senderUid || notif.actor?.uid || notif.actor?.id;
    if (!senderUid) return;

    toggleFollowUser(senderUid);
  };

  const renderNotificationCard = (notif: AppNotification) => {
    const notifId = notif.notificationId || notif.id || `notif_${Math.random()}`;
    const avatar = notif.senderPhotoURL || notif.actor?.avatar || notif.actor?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
    const senderName = notif.senderName || notif.actor?.fullName || notif.actor?.name || 'उपयोगकर्ता';
    const senderUid = notif.senderUid || notif.actor?.uid || notif.actor?.id;
    const isFollowingSender = senderUid ? followingIds.includes(senderUid) : false;

    return (
      <div
        key={notifId}
        onClick={() => handleCardClick(notif)}
        className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
          notif.isRead
            ? 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-900/70 hover:border-slate-700'
            : 'bg-gradient-to-r from-orange-950/20 via-slate-900/95 to-slate-900/90 border-orange-500/40 text-slate-200 shadow-sm shadow-orange-500/5 hover:border-orange-500/60'
        }`}
      >
        {/* Unread Glowing Dot indicator */}
        {!notif.isRead && (
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-orange-500 ring-4 ring-orange-500/20 animate-pulse" />
        )}

        <div className="flex items-center gap-3.5 min-w-0">
          {/* Avatar with type badge */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              if (notif.actor) {
                openUserProfile(notif.actor);
              } else if (senderUid) {
                openUserProfile({
                  id: senderUid,
                  uid: senderUid,
                  fullName: senderName,
                  name: senderName,
                  username: senderName.toLowerCase().replace(/\s+/g, ''),
                  handle: `@${senderName.toLowerCase().replace(/\s+/g, '')}`,
                  avatar,
                  photoURL: avatar,
                  bio: 'भारत कनेक्ट सदस्य 🇮🇳',
                  location: 'भारत',
                  verified: false,
                  followersCount: 0,
                  followingCount: 0,
                  postCount: 0,
                  language: 'hi'
                });
              }
            }}
            className="relative shrink-0 hover:scale-105 transition-transform"
            title="प्रोफ़ाइल देखें"
          >
            <img
              src={avatar}
              alt={senderName}
              className="w-11 h-11 rounded-full object-cover border-2 border-slate-800 ring-1 ring-slate-700"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center shadow-md">
              {getIcon(notif.type)}
            </div>
          </div>

          {/* Content text */}
          <div className="min-w-0 text-xs leading-relaxed pr-2">
            <div>
              <span className="font-semibold text-white mr-1.5 hover:underline">
                {senderName}
              </span>
              <span className={notif.isRead ? 'text-slate-400' : 'text-slate-200'}>
                {getNotificationText(notif)}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
              <span className="font-mono">{notif.timeAgo || 'कुछ समय पहले'}</span>
              <span>·</span>
              <span className="capitalize text-slate-400 font-medium">
                {notif.type === 'like' ? 'लाइक' : notif.type === 'comment' ? 'टिप्पणी' : notif.type === 'follow' ? 'फ़ॉलो' : 'अलर्ट'}
              </span>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Post preview thumbnail */}
          {notif.postPreview && (
            <img
              src={notif.postPreview}
              alt="Post preview"
              className="w-10 h-10 rounded-xl object-cover border border-slate-800 shrink-0"
            />
          )}

          {/* Follow back button for follow type */}
          {notif.type === 'follow' && (
            <button
              onClick={(e) => handleFollowBack(notif, e)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition shrink-0 ${
                isFollowingSender
                  ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm'
              }`}
            >
              {isFollowingSender ? 'फ़ॉलो किया' : 'फ़ॉलो बैक'}
            </button>
          )}

          {/* Quick Mark Read/Unread Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (notif.isRead) {
                markNotificationUnread(notifId);
              } else {
                markNotificationRead(notifId);
              }
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-orange-400 hover:bg-slate-800/80 transition opacity-80 group-hover:opacity-100"
            title={notif.isRead ? 'अपठित मार्क करें' : 'पठित मार्क करें'}
          >
            {notif.isRead ? <EyeOff className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Delete Notification */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteNotificationItem(notifId);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 transition opacity-0 group-hover:opacity-100"
            title="सूचना हटाएं"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 space-y-4">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white leading-tight">
                  {t.notifications}
                </h1>
                {unreadNotificationsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[11px] font-bold">
                    {unreadNotificationsCount} नई
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Firestore रीयल-टाइम अपडेट सक्रिय</span>
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              disabled={unreadNotificationsCount === 0}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 disabled:text-slate-600 border border-slate-800 text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              title="सब पढ़ें (Mark all read)"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline font-medium">सब पढ़ें</span>
            </button>
          </div>
        </div>

        {/* Not Logged In Notice Banner */}
        {!isFirebaseAuthLoggedIn && (
          <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-amber-950/30 border border-orange-500/30 rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-orange-400">लॉगिन आवश्यक: </span>
              अपनी रीयल-टाइम Firestore सूचनाएं पाने के लिए लॉगिन करें।
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1 shrink-0 transition shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>लॉगिन</span>
            </button>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              filter === 'all'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            सभी ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              filter === 'unread'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>अपठित</span>
            {unreadNotificationsCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filter === 'unread' ? 'bg-white text-orange-600' : 'bg-orange-500/20 text-orange-400'
              }`}>
                {unreadNotificationsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              filter === 'read'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            पठित ({readItems.length})
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isNotificationsLoading && (
        <div className="space-y-2 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-slate-800 rounded w-3/4" />
                <div className="h-2.5 bg-slate-800/60 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty States */}
      {!isNotificationsLoading && filteredNotifications.length === 0 && (
        <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 my-4 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto text-slate-500 border border-slate-700/50">
            <Bell className="w-7 h-7 stroke-1" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-300">
              {filter === 'unread' 
                ? 'कोई नई अपठित सूचना नहीं है' 
                : filter === 'read'
                ? 'कोई पुरानी पढ़ी हुई सूचना नहीं है'
                : t.noNotifications}
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              जब कोई यूज़र आपकी पोस्ट को लाइक करेगा, कमेंट लिखेगा या आपको फ़ॉलो करेगा, तो सूचनाएं रीयल-टाइम में तुरंत यहां दिखेंगी।
            </p>
          </div>
        </div>
      )}

      {/* List Display (Grouped into New and Earlier if showing all) */}
      {!isNotificationsLoading && filteredNotifications.length > 0 && (
        <div className="space-y-4">
          {filter === 'all' ? (
            <>
              {/* Unread Section */}
              {unreadItems.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-orange-400 tracking-wide uppercase">
                      नई सूचनाएं ({unreadItems.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {unreadItems.map((n) => renderNotificationCard(n))}
                  </div>
                </div>
              )}

              {/* Read Section */}
              {readItems.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                      पुरानी सूचनाएं ({readItems.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {readItems.map((n) => renderNotificationCard(n))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((n) => renderNotificationCard(n))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
