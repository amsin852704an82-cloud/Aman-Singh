import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RedisKeyItem } from '../types';
import { 
  Layers, 
  Terminal, 
  Trash2, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Play, 
  RefreshCw 
} from 'lucide-react';

export const RedisExplorer: React.FC = () => {
  const { redisKeys, setRedisKey, deleteRedisKey, flushRedisCache } = useApp();
  const [filterPattern, setFilterPattern] = useState('');
  const [cliInput, setCliInput] = useState('PING');
  const [cliLogs, setCliLogs] = useState<string[]>([
    '127.0.0.1:6379> INFO memory',
    '# Memory',
    'used_memory_human:28.4M',
    'maxmemory_human:512.0M',
    'maxmemory_policy:allkeys-lru',
    '127.0.0.1:6379> PING',
    'PONG'
  ]);
  const [selectedKey, setSelectedKey] = useState<RedisKeyItem | null>(null);

  // New key modal state
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyVal, setNewKeyVal] = useState('');
  const [newKeyType, setNewKeyType] = useState<RedisKeyItem['type']>('string');
  const [newKeyTtl, setNewKeyTtl] = useState(300);

  const filteredKeys = redisKeys.filter((k) =>
    k.key.toLowerCase().includes(filterPattern.toLowerCase())
  );

  const handleRunCli = (cmd?: string) => {
    const raw = (cmd || cliInput).trim();
    if (!raw) return;

    const parts = raw.split(' ');
    const op = parts[0].toUpperCase();
    let response = '';

    if (op === 'PING') {
      response = 'PONG';
    } else if (op === 'KEYS') {
      response = redisKeys.map((k, i) => `${i + 1}) "${k.key}"`).join('\n') || '(empty list or set)';
    } else if (op === 'GET') {
      const target = parts[1];
      const match = redisKeys.find((k) => k.key === target);
      response = match ? `"${match.value}"` : '(nil)';
    } else if (op === 'SET') {
      const k = parts[1];
      const val = parts.slice(2).join(' ') || 'OK';
      setRedisKey(k, val, 'string', 300);
      response = 'OK';
    } else if (op === 'TTL') {
      const match = redisKeys.find((k) => k.key === parts[1]);
      response = match ? `(integer) ${match.ttl}` : '(integer) -2';
    } else if (op === 'DEL') {
      deleteRedisKey(parts[1]);
      response = '(integer) 1';
    } else if (op === 'FLUSHALL') {
      flushRedisCache();
      response = 'OK (Evicted all keys)';
    } else if (op === 'INFO') {
      response = 'redis_version:7.2.4\nconnected_clients:6\nused_memory:29779520\nmaxmemory:536870912\nmaxmemory_policy:allkeys-lru';
    } else {
      response = `(error) ERR unknown command '${op}'`;
    }

    setCliLogs((prev) => [...prev, `127.0.0.1:6379> ${raw}`, response]);
    if (!cmd) setCliInput('');
  };

  const handleCreateNewKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setRedisKey(newKeyName.trim(), newKeyVal, newKeyType, Number(newKeyTtl));
    setNewKeyName('');
    setNewKeyVal('');
    setIsAddingKey(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Redis Service Header Card */}
      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <Layers className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Redis 7 (bharat_redis)</h2>
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Healthy (Port 6379)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              POLICY: allkeys-lru · MAXMEMORY: 512MB · AOF: yes · ROLE: Cache + Queue
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">MEMORY USAGE</span>
            <span className="text-slate-200 font-bold tabular-nums">28.4 MB / 512 MB</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">HIT RATIO</span>
            <span className="text-emerald-400 font-bold tabular-nums">94.2%</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">ACTIVE KEYS</span>
            <span className="text-orange-400 font-bold tabular-nums">{redisKeys.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Keys Explorer (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={filterPattern}
                onChange={(e) => setFilterPattern(e.target.value)}
                placeholder="Filter keys (e.g. feed:*, session:*)..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 text-xs rounded-lg border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddingKey(true)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Set Key</span>
              </button>
              <button
                onClick={flushRedisCache}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Flush all keys from memory"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>FLUSHALL</span>
              </button>
            </div>
          </div>

          {/* Keys Data Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-3.5 py-2.5">Key Name</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5">TTL</th>
                  <th className="px-3 py-2.5">Size</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredKeys.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No matching Redis keys found
                    </td>
                  </tr>
                ) : (
                  filteredKeys.map((item) => (
                    <tr
                      key={item.key}
                      onClick={() => setSelectedKey(item)}
                      className={`cursor-pointer transition-colors ${
                        selectedKey?.key === item.key ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="px-3.5 py-2.5 text-slate-200 font-semibold truncate max-w-[200px]">
                        {item.key}
                      </td>
                      <td className="px-3 py-2.5 text-red-400 uppercase text-[10px]">
                        {item.type}
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 tabular-nums">
                        {item.ttl === -1 ? 'persisted' : `${item.ttl}s`}
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 tabular-nums">
                        {item.sizeBytes} B
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRedisKey(item.key);
                          }}
                          className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Key Inspector Drawer */}
          {selectedKey && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="font-mono font-bold text-red-400">{selectedKey.key}</span>
                <span className="text-slate-500 text-[11px]">Updated {selectedKey.updatedAt}</span>
              </div>
              <div className="font-mono text-slate-300 bg-slate-900 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {selectedKey.value}
              </div>
            </div>
          )}
        </div>

        {/* Redis CLI Console (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-red-400" />
              redis-cli Console
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleRunCli('PING')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-mono text-slate-300 cursor-pointer"
              >
                PING
              </button>
              <button
                onClick={() => handleRunCli('KEYS *')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-mono text-slate-300 cursor-pointer"
              >
                KEYS *
              </button>
              <button
                onClick={() => handleRunCli('INFO')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-mono text-slate-300 cursor-pointer"
              >
                INFO
              </button>
            </div>
          </div>

          {/* CLI Terminal Output */}
          <div className="h-64 p-3 bg-slate-950 font-mono text-xs rounded-xl border border-slate-800 text-slate-300 overflow-y-auto space-y-1">
            {cliLogs.map((log, index) => (
              <div
                key={index}
                className={log.startsWith('127.0.0.1:6379>') ? 'text-amber-400' : 'text-slate-300 whitespace-pre-line'}
              >
                {log}
              </div>
            ))}
          </div>

          {/* CLI Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunCli();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={cliInput}
              onChange={(e) => setCliInput(e.target.value)}
              placeholder="e.g. GET trending:hashtags"
              className="flex-1 px-3 py-1.5 bg-slate-950 font-mono text-xs rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500/60"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Add Key Modal */}
      {isAddingKey && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-400" />
                Add Redis Key
              </h4>
              <button
                onClick={() => setIsAddingKey(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewKey} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Key Name</label>
                <input
                  type="text"
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. feed:user:999:timeline"
                  className="w-full px-3 py-2 bg-slate-950 text-slate-200 font-mono rounded-lg border border-slate-800 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Data Type</label>
                  <select
                    value={newKeyType}
                    onChange={(e) => setNewKeyType(e.target.value as RedisKeyItem['type'])}
                    className="w-full px-3 py-2 bg-slate-950 text-slate-200 font-mono rounded-lg border border-slate-800 focus:outline-none"
                  >
                    <option value="string">string</option>
                    <option value="hash">hash</option>
                    <option value="zset">zset</option>
                    <option value="list">list</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">TTL (Seconds)</label>
                  <input
                    type="number"
                    value={newKeyTtl}
                    onChange={(e) => setNewKeyTtl(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 text-slate-200 font-mono rounded-lg border border-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Value Payload</label>
                <textarea
                  rows={3}
                  required
                  value={newKeyVal}
                  onChange={(e) => setNewKeyVal(e.target.value)}
                  placeholder="e.g. { active: true }"
                  className="w-full px-3 py-2 bg-slate-950 text-slate-200 font-mono rounded-lg border border-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingKey(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-500 cursor-pointer"
                >
                  Save Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
