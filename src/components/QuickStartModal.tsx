import React, { useState } from 'react';
import { Copy, Check, Terminal, X, Play } from 'lucide-react';

export const QuickStartModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const quickScript = `# 1. Clone or navigate to your project
mkdir -p bharat-social && cd bharat-social

# 2. Start PostgreSQL, Redis & MinIO services in detached mode
docker compose up -d

# 3. Check health of services
docker compose ps

# 4. Open MinIO S3 Console at:
# http://localhost:9001 (User: minioadmin / Pass: minioadmin123)

# 5. Connect PostgreSQL:
# psql -h localhost -U bharat -d bharat_social -p 5432`;

  const handleCopy = () => {
    navigator.clipboard.writeText(quickScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Play className="w-4 h-4 fill-orange-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Launch Bharat Social Stack</h3>
              <p className="text-xs text-slate-400">PostgreSQL 15 · Redis 7 · MinIO S3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            Run the following commands in your terminal where your <code className="text-orange-400 bg-slate-950 px-1 py-0.5 rounded">docker-compose.yml</code> and <code className="text-orange-400 bg-slate-950 px-1 py-0.5 rounded">init.sql</code> files are placed:
          </p>

          <div className="relative">
            <pre className="p-4 bg-slate-950 font-mono text-xs rounded-xl border border-slate-800 text-slate-200 overflow-x-auto leading-relaxed">
              {quickScript}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Commands'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-200 block">Service Endpoints:</span>
            <ul className="space-y-0.5 font-mono text-[11px] text-slate-400">
              <li>• Postgres: <span className="text-blue-400">localhost:5432</span> (DB: bharat_social)</li>
              <li>• Redis: <span className="text-red-400">localhost:6379</span> (LRU 512MB)</li>
              <li>• MinIO S3 API: <span className="text-amber-400">localhost:9000</span></li>
              <li>• MinIO Web UI: <span className="text-amber-400">http://localhost:9001</span></li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
