import React, { useState } from 'react';
import { DOCKER_COMPOSE_RAW, ENV_TEMPLATE } from '../data/initialData';
import { 
  Boxes, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Cpu, 
  Database, 
  Layers, 
  HardDrive, 
  Server,
  ArrowRight
} from 'lucide-react';

export const DockerComposeView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compose' | 'env' | 'topology'>('compose');
  const [copiedCompose, setCopiedCompose] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (text: string, type: 'compose' | 'env') => {
    navigator.clipboard.writeText(text);
    if (type === 'compose') {
      setCopiedCompose(true);
      setTimeout(() => setCopiedCompose(false), 2000);
    } else {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    }
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Boxes className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Docker Compose Services Workbench</h2>
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                Compose Spec v3.9
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Microservices orchestration for Bharat Social infrastructure stack
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'compose'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>docker-compose.yml</span>
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'env'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>.env Configuration</span>
          </button>
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'topology'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Topology & Ports</span>
          </button>
        </div>
      </div>

      {/* Quick Shell Commands Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Start All Services', cmd: 'docker compose up -d' },
          { label: 'Follow Logs', cmd: 'docker compose logs -f' },
          { label: 'Check Health', cmd: 'docker compose ps' },
          { label: 'Teardown + Volumes', cmd: 'docker compose down -v' }
        ].map((item) => (
          <div
            key={item.cmd}
            onClick={() => handleCopyCommand(item.cmd)}
            className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer group"
          >
            <span className="text-[11px] text-slate-400 block mb-1">{item.label}</span>
            <div className="flex items-center justify-between font-mono text-xs text-cyan-300">
              <span className="truncate">{item.cmd}</span>
              {copiedCmd === item.cmd ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-1" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View 1: Docker Compose Raw */}
      {activeTab === 'compose' && (
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">docker-compose.yml</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Contains PostgreSQL 15, Redis 7 (LRU 512MB), MinIO S3 and NestJS backend ready to uncomment
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(DOCKER_COMPOSE_RAW, 'compose')}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCompose ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCompose ? 'Copied' : 'Copy Compose YAML'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile('docker-compose.yml', DOCKER_COMPOSE_RAW)}
                className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download YAML</span>
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-950 font-mono text-xs rounded-xl border border-slate-800 text-cyan-200 overflow-x-auto max-h-[520px] leading-relaxed">
            {DOCKER_COMPOSE_RAW}
          </pre>
        </div>
      )}

      {/* View 2: .env Configuration */}
      {activeTab === 'env' && (
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">.env (Local Environment File)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Variables corresponding to PostgreSQL credentials, Redis host, MinIO S3 credentials and JWT secret
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(ENV_TEMPLATE, 'env')}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEnv ? 'Copied' : 'Copy .env'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile('.env', ENV_TEMPLATE)}
                className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .env</span>
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-950 font-mono text-xs rounded-xl border border-slate-800 text-emerald-200 overflow-x-auto max-h-[520px] leading-relaxed">
            {ENV_TEMPLATE}
          </pre>
        </div>
      )}

      {/* View 3: Architecture Topology & Ports */}
      {activeTab === 'topology' && (
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white">Bharat Social Infrastructure Topology</h3>
            <p className="text-xs text-slate-400 mt-1">
              Data flow from Client Web App to NestJS Microservices, persistence in PostgreSQL 15, low-latency caching in Redis 7, and media streaming in MinIO S3.
            </p>
          </div>

          {/* Architecture Visual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Box 1: Client Layer */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
                UI
              </div>
              <h4 className="text-xs font-bold text-white">Client / Mobile Web</h4>
              <p className="text-[11px] text-slate-400">Bharat Social React App</p>
              <span className="inline-block px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-mono">
                Port 3000
              </span>
            </div>

            {/* Box 2: Backend Gateway */}
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">NestJS API Gateway</h4>
              <p className="text-[11px] text-slate-400">REST & WebSockets</p>
              <span className="inline-block px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono">
                Port 3000
              </span>
            </div>

            {/* Box 3: Data & Cache Services */}
            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Postgres */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/30 text-center space-y-1.5">
                <Database className="w-5 h-5 mx-auto text-blue-400" />
                <h5 className="text-xs font-semibold text-white">PostgreSQL 15</h5>
                <p className="text-[10px] text-slate-400">bharat_social</p>
                <span className="inline-block px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                  :5432
                </span>
              </div>

              {/* Redis */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-red-500/30 text-center space-y-1.5">
                <Layers className="w-5 h-5 mx-auto text-red-400" />
                <h5 className="text-xs font-semibold text-white">Redis 7</h5>
                <p className="text-[10px] text-slate-400">Queue & LRU Cache</p>
                <span className="inline-block px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-mono">
                  :6379
                </span>
              </div>

              {/* MinIO */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 text-center space-y-1.5">
                <HardDrive className="w-5 h-5 mx-auto text-amber-400" />
                <h5 className="text-xs font-semibold text-white">MinIO S3</h5>
                <p className="text-[10px] text-slate-400">Media & Reels</p>
                <span className="inline-block px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                  :9000/:9001
                </span>
              </div>
            </div>
          </div>

          {/* Volume storage mapping breakdown */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200">Persistent Docker Volumes Configured</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px] text-slate-400">
              <div className="p-2 bg-slate-900 rounded">
                <span className="text-blue-400 font-bold">postgres_data</span>
                <p className="text-slate-500 mt-0.5">/var/lib/postgresql/data</p>
              </div>
              <div className="p-2 bg-slate-900 rounded">
                <span className="text-red-400 font-bold">redis_data</span>
                <p className="text-slate-500 mt-0.5">/data (AOF enabled)</p>
              </div>
              <div className="p-2 bg-slate-900 rounded">
                <span className="text-amber-400 font-bold">minio_data</span>
                <p className="text-slate-500 mt-0.5">/data (Object blobs)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
