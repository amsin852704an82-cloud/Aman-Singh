import React from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { Shield, AlertTriangle, CheckCircle, XCircle, Trash2, Users, FileText, Flag } from 'lucide-react';

export const AdminView: React.FC = () => {
  const { reports, resolveReport, posts, users, t } = useBharatConnect();

  const pendingReports = reports.filter((r) => r.status === 'pending');
  const resolvedReports = reports.filter((r) => r.status !== 'pending');

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {t.adminPanel} (सुरक्षा एवं मॉडरेशन)
              </h1>
              <p className="text-xs text-slate-400">
                सामुदायिक दिशानिर्देशों (Community Guidelines) का उल्लंघन रोकने हेतु मॉडरेशन डैशबोर्ड
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>लंबित: {pendingReports.length}</span>
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">{users.length}</div>
            <div className="text-[11px] text-slate-400">सक्रिय यूज़र्स</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">{posts.length}</div>
            <div className="text-[11px] text-slate-400">कुल पोस्ट्स</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">{reports.length}</div>
            <div className="text-[11px] text-slate-400">कुल रिपोर्ट्स</div>
          </div>
        </div>
      </div>

      {/* Pending Reports Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>लंबित रिपोर्ट्स (Pending Content Moderation)</span>
        </h2>

        {pendingReports.length === 0 ? (
          <div className="p-10 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-slate-300">कोई भी लंबित रिपोर्ट नहीं है</p>
            <p className="text-xs text-slate-500 mt-0.5">सभी रिपोर्टों की समीक्षा पूरी हो चुकी है। समुदाय सुरक्षित है!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={report.reportedUser.avatar}
                      alt={report.reportedUser.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">
                        आरोपी: {report.reportedUser.fullName} ({report.reportedUser.handle})
                      </div>
                      <div className="text-[11px] text-slate-400">
                        रिपोर्टर: {report.reporterUser.fullName} · {report.createdAt}
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold">
                    {report.reason}
                  </span>
                </div>

                {/* Post Preview if post reported */}
                {report.reportedPostCaption && (
                  <div className="flex gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {report.reportedPostImage && (
                      <img
                        src={report.reportedPostImage}
                        alt="Reported content"
                        className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-800"
                      />
                    )}
                    <div className="flex-1 text-xs">
                      <div className="text-slate-400 text-[10px]">रिपोर्ट की गई सामग्री:</div>
                      <p className="text-slate-200 mt-0.5 line-clamp-2">
                        "{report.reportedPostCaption}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => resolveReport(report.id, 'dismissed')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t.dismiss}</span>
                  </button>

                  <button
                    onClick={() => resolveReport(report.id, 'resolved')}
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-red-600/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>हटाएं एवं हल करें (Remove & Resolve)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Moderation History */}
      {resolvedReports.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h2 className="text-xs font-bold text-slate-400">
            पिछले निर्णय (Past Moderation Actions)
          </h2>
          <div className="divide-y divide-slate-800/80 bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden">
            {resolvedReports.map((r) => (
              <div key={r.id} className="p-3 text-xs flex items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-white">{r.reportedUser.fullName}</span>
                  <span className="text-slate-400 ml-1">के विरुद्ध शिकायत ({r.reason})</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    r.status === 'resolved'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {r.status === 'resolved' ? 'हल किया गया (Action Taken)' : 'खारिज (Dismissed)'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
