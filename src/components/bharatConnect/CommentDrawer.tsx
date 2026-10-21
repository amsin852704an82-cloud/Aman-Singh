import React, { useState } from 'react';
import { Post } from '../../types/bharatConnect';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { X, Send, Heart } from 'lucide-react';

interface CommentDrawerProps {
  post: Post | null;
  onClose: () => void;
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({ post, onClose }) => {
  const { addComment, t, currentUser } = useBharatConnect();
  const [commentText, setCommentText] = useState('');

  if (!post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle for Mobile */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">
            {t.comments} ({post.comments.length})
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-96">
          {post.comments.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              अभी कोई टिप्पणी नहीं है। पहली टिप्पणी लिखें!
            </div>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 text-xs">
                <img
                  src={comment.author.avatar}
                  alt={comment.author.fullName}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white">{comment.author.fullName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{comment.createdAt}</span>
                  </div>
                  <p className="text-slate-200 mt-0.5 leading-relaxed">{comment.text}</p>
                </div>
                <button className="text-slate-500 hover:text-rose-500 pt-1 cursor-pointer">
                  <Heart className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <img
            src={currentUser.avatar}
            alt={currentUser.fullName}
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t.writeComment}
            className="flex-1 bg-slate-900 text-xs text-slate-200 px-3.5 py-2.5 rounded-full border border-slate-800 focus:outline-none focus:border-orange-500/60 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="w-9 h-9 rounded-full bg-orange-500 disabled:bg-slate-800 text-white disabled:text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
