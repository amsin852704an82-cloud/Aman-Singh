import React, { useState, useEffect } from 'react';
import { Post, PostComment } from '../../types/bharatConnect';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { subscribeToPostComments, deleteFirestoreComment } from '../../lib/postService';
import { X, Send, Heart, Trash2, MessageCircle, Loader2 } from 'lucide-react';

interface CommentDrawerProps {
  post: Post | null;
  onClose: () => void;
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({ post, onClose }) => {
  const { addComment, t, currentUser, isFirebaseAuthLoggedIn, setIsAuthModalOpen } = useBharatConnect();
  const [commentText, setCommentText] = useState('');
  const [firestoreComments, setFirestoreComments] = useState<PostComment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subscribe to real-time comments from Firestore sub-collection: posts/{postId}/comments
  useEffect(() => {
    if (!post?.id) return;

    // Use initial local comments while listening
    if (post.comments && post.comments.length > 0) {
      setFirestoreComments(post.comments);
    }

    const unsub = subscribeToPostComments(post.id, (comments) => {
      if (comments.length > 0) {
        setFirestoreComments(comments);
      }
    });

    return () => unsub();
  }, [post?.id]);

  if (!post) return null;

  const currentUid = currentUser.uid || currentUser.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const txt = commentText.trim();
    if (!txt) return;

    if (!isFirebaseAuthLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await addComment(post.id, txt);
      setCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('क्या आप यह टिप्पणी हटाना चाहते हैं?')) return;
    try {
      await deleteFirestoreComment(post.id, commentId);
      setFirestoreComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) {
      console.error('Delete comment error:', e);
    }
  };

  const displayedComments = firestoreComments.length > 0 ? firestoreComments : post.comments;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Grab Handle for Mobile */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <MessageCircle className={`w-4 h-4 ${post.isAnonymous ? 'text-purple-400' : 'text-orange-400'}`} />
            <h3 className="font-bold text-sm text-white">
              {t.comments} ({displayedComments.length})
            </h3>
            {post.isAnonymous && (
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                🔒 दिल से स्पेस
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anonymous Post Safe Space Banner */}
        {post.isAnonymous && (
          <div className="px-4 py-2 bg-purple-950/40 border-b border-purple-500/20 text-purple-200 text-[11px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shrink-0" />
            <span>
              <strong>दिल से सेफ स्पेस:</strong> इस पोस्ट पर सभी कमेंट्स अनाम (Anonymous) रूप से दिखाए जाते हैं।
            </span>
          </div>
        )}

        {/* Comments Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-96 min-h-[220px]">
          {displayedComments.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
              <MessageCircle className="w-8 h-8 text-slate-600 stroke-1" />
              <p>अभी कोई टिप्पणी नहीं है। पहली टिप्पणी लिखें!</p>
            </div>
          ) : (
            displayedComments.map((comment, index) => {
              const isAnonymousPost = post.isAnonymous;
              const authorAvatar = isAnonymousPost
                ? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=80'
                : (comment.author?.photoURL || comment.author?.avatar || comment.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80');
              const authorName = isAnonymousPost
                ? `अनाम साथी #${(index % 9) + 1}`
                : (comment.author?.fullName || comment.author?.name || comment.authorName || 'भारत नागरिक');
              const isMyComment = comment.authorUid === currentUid || comment.author?.id === currentUid;

              return (
                <div key={comment.id} className="flex items-start gap-3 text-xs group">
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className={`w-8 h-8 rounded-full object-cover shrink-0 border ${
                      isAnonymousPost ? 'border-purple-400/60 bg-purple-950/50' : 'border-slate-700'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold ${isAnonymousPost ? 'text-purple-300' : 'text-white'}`}>{authorName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{comment.createdAt}</span>
                      </div>

                      {isMyComment && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition"
                          title="टिप्पणी हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-slate-200 mt-1 leading-relaxed break-words">{comment.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <img
            src={
              post.isAnonymous 
                ? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=80' 
                : (currentUser.photoURL || currentUser.avatar)
            }
            alt={post.isAnonymous ? 'अनाम' : (currentUser.fullName || currentUser.name)}
            className={`w-8 h-8 rounded-full object-cover shrink-0 border ${
              post.isAnonymous ? 'border-purple-400/60' : 'border-orange-500/40'
            }`}
          />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              post.isAnonymous 
                ? 'अनाम रूप से सांत्वना या विचार लिखें...' 
                : (isFirebaseAuthLoggedIn ? t.writeComment : 'कमेंट करने के लिए लॉगिन करें...')
            }
            disabled={isSubmitting}
            className="flex-1 bg-slate-900 text-xs text-slate-200 px-3.5 py-2.5 rounded-full border border-slate-800 focus:outline-none focus:border-orange-500 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || isSubmitting}
            className={`w-9 h-9 rounded-full ${
              post.isAnonymous 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600' 
                : 'bg-gradient-to-r from-orange-500 to-amber-500'
            } disabled:from-slate-800 disabled:to-slate-800 text-white disabled:text-slate-600 flex items-center justify-center transition shadow-md active:scale-95 cursor-pointer shrink-0`}
          >
            {isSubmitting ? (
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
