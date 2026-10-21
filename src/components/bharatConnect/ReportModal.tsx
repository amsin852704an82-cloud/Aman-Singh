import React, { useState } from 'react';
import { Post, User } from '../../types/bharatConnect';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { ShieldAlert, X, AlertTriangle, Ban } from 'lucide-react';

interface ReportModalProps {
  targetPost?: Post | null;
  targetUser?: User | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  targetPost,
  targetUser,
  onClose
}) => {
  const { reportContent, blockUser, t } = useBharatConnect();
  const [selectedReason, setSelectedReason] = useState('स्पैम या बॉट (Spam / Bot)');
  const [details, setDetails] = useState('');

  const target = targetUser || targetPost?.author;
  if (!target) return null;

  const reasons = [
    'स्पैम या बॉट (Spam / Bot)',
    'नफ़रत फैलाने वाला भाषण (Hate Speech)',
    'भ्रामक या झूठी सूचना (Misinformation)',
    'अनुचित या आपत्तिजनक सामग्री (Inappropriate Content)',
    'कॉपीराइट उल्लंघन (Copyright Infringement)'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportContent(target.id, selectedReason, details.trim() || undefined, targetPost?.id);
    onClose();
  };

  const handleBlock = () => {
    blockUser(target.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-white text-sm">
              {t.reportUser}: {target.fullName} ({target.handle})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{t.selectReason}:</span>
            </label>
            <div className="space-y-2">
              {reasons.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    selectedReason === r
                      ? 'bg-rose-500/10 border-rose-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                    className="accent-rose-500"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">अतिरिक्त विवरण (वैकल्पिक / Optional):</label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="समस्या का संक्षेप में विवरण दें..."
              className="w-full p-2.5 bg-slate-950 text-slate-200 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500/60 resize-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBlock}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Ban className="w-4 h-4" />
              <span>{target.fullName} को ब्लॉक करें</span>
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {t.submitReport}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
