import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INIT_SQL_TEMPLATE } from '../data/initialData';
import { 
  Database, 
  Terminal, 
  Table, 
  Copy, 
  Check, 
  Play, 
  Download, 
  CheckCircle2, 
  FileCode, 
  Zap, 
  Search,
  Filter
} from 'lucide-react';

export const PostgresExplorer: React.FC = () => {
  const { dbTables, runSqlQuery } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'tables' | 'query' | 'triggers' | 'initsql'>('tables');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTable, setSelectedTable] = useState<string>('posts');
  const [searchTable, setSearchTable] = useState<string>('');
  const [sqlInput, setSqlInput] = useState<string>('SELECT * FROM creator_earnings ORDER BY total_earned_paise DESC;');
  const [queryResult, setQueryResult] = useState<{
    columns: string[];
    rows: (string | number | boolean | null)[][];
    durationMs: number;
    error?: string;
  } | null>(() => runSqlQuery('SELECT * FROM creator_earnings ORDER BY total_earned_paise DESC;'));

  const [copiedSql, setCopiedSql] = useState(false);

  const categories = ['All', 'Core Social', 'Engagement & Stories', 'DMs & Moderation', 'Creator Economy & UPI'];

  const filteredTables = dbTables.filter((tbl) => {
    const matchCat = selectedCategory === 'All' || tbl.category === selectedCategory;
    const matchSearch = tbl.name.toLowerCase().includes(searchTable.toLowerCase()) || tbl.description.toLowerCase().includes(searchTable.toLowerCase());
    return matchCat && matchSearch;
  });

  const currentTableData = dbTables.find((t) => t.name === selectedTable) || dbTables[0];

  const handleRunQuery = () => {
    const res = runSqlQuery(sqlInput);
    setQueryResult(res);
  };

  const handleCopyInitSql = () => {
    navigator.clipboard.writeText(INIT_SQL_TEMPLATE);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadInitSql = () => {
    const blob = new Blob([INIT_SQL_TEMPLATE], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'init.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Postgres Service Header Card */}
      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <Database className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">PostgreSQL 14+ (bharat_postgres)</h2>
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                20 Tables & Triggers Active (Port 5432)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              DATABASE: bharat_social · USER: bharat · EXTENSIONS: uuid-ossp, pg_trgm
            </p>
          </div>
        </div>

        {/* Sub-navigation Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('tables')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'tables'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Tables ({dbTables.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('triggers')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'triggers'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Triggers (4)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('query')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'query'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>SQL Runner</span>
          </button>
          <button
            onClick={() => setActiveSubTab('initsql')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'initsql'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>init.sql DDL</span>
          </button>
        </div>
      </div>

      {/* View 1: Tables Explorer */}
      {activeSubTab === 'tables' && (
        <div className="space-y-4">
          {/* Category filter pills and table search */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                placeholder="Search table or column..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 text-xs rounded-xl border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Tables List Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredTables.map((tbl) => {
                const isSelected = tbl.name === selectedTable;
                return (
                  <div
                    key={tbl.name}
                    onClick={() => setSelectedTable(tbl.name)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-blue-500/50 shadow-sm'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-white">
                        public.{tbl.name}
                      </span>
                      <span className="text-[11px] font-mono tabular-nums text-slate-400">
                        {tbl.rowCount} rows
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{tbl.description}</p>
                    <span className="text-[10px] text-blue-400 font-mono mt-1 block">
                      {tbl.category}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Table Data View (8 cols) */}
            <div className="lg:col-span-8 p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-sm font-bold text-white">
                      public.{currentTableData.name}
                    </h3>
                    <span className="text-xs text-blue-400 font-mono">
                      [{currentTableData.category}]
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{currentTableData.description}</p>
                </div>
                <button
                  onClick={() => {
                    setSqlInput(`SELECT * FROM ${currentTableData.name} LIMIT 20;`);
                    setActiveSubTab('query');
                    handleRunQuery();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                >
                  Run Query
                </button>
              </div>

              {/* Columns metadata summary */}
              <div className="flex flex-wrap gap-1.5 text-xs font-mono text-slate-400">
                {currentTableData.columns.map((col) => (
                  <span key={col.name} className="px-2 py-0.5 bg-slate-950 rounded border border-slate-800 text-[11px]">
                    {col.name}: <span className="text-blue-400">{col.type}</span>
                    {col.isPrimary && ' 🔑'}
                  </span>
                ))}
              </div>

              {/* Table Rows Data Grid */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 font-mono text-slate-400 border-b border-slate-800">
                    <tr>
                      {currentTableData.columns.map((col) => (
                        <th key={col.name} className="px-3.5 py-2.5 whitespace-nowrap">
                          {col.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {currentTableData.rows.length === 0 ? (
                      <tr>
                        <td colSpan={currentTableData.columns.length} className="px-4 py-6 text-center text-slate-500">
                          No rows currently in this table.
                        </td>
                      </tr>
                    ) : (
                      currentTableData.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                          {currentTableData.columns.map((col) => {
                            const val = row[col.name];
                            return (
                              <td key={col.name} className="px-3.5 py-2 text-slate-300 whitespace-nowrap tabular-nums max-w-xs truncate">
                                {val === null ? (
                                  <span className="text-slate-600 italic">null</span>
                                ) : typeof val === 'boolean' ? (
                                  val ? 'true' : 'false'
                                ) : (
                                  String(val)
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Triggers Engine */}
      {activeSubTab === 'triggers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: 'trg_like_count',
              target: 'AFTER INSERT OR DELETE ON likes',
              action: 'UPDATE posts SET like_count = like_count +/- 1 WHERE id = post_id',
              desc: 'Automatically keeps posts.like_count synchronized with zero application latency or polling.'
            },
            {
              name: 'trg_follow_count',
              target: 'AFTER INSERT OR DELETE ON follows',
              action: 'UPDATE users SET follower_count/following_count +/- 1',
              desc: 'Maintains reciprocal follower and following counters on users table atomically.'
            },
            {
              name: 'trg_comment_count',
              target: 'AFTER INSERT OR DELETE ON comments',
              action: 'UPDATE posts SET comment_count = comment_count +/- 1 WHERE id = post_id',
              desc: 'Atomically updates comment totals upon comment creation or deletion.'
            },
            {
              name: 'trg_post_count',
              target: 'AFTER INSERT OR DELETE ON posts',
              action: 'UPDATE users SET post_count = post_count +/- 1 WHERE id = user_id',
              desc: 'Maintains user profile post metrics when publishing or deleting posts.'
            }
          ].map((trg) => (
            <div key={trg.name} className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-mono text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  {trg.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{trg.desc}</p>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] space-y-1">
                <span className="text-slate-500 block">Trigger Definition:</span>
                <p className="text-blue-300">{trg.target}</p>
                <p className="text-emerald-300">{trg.action}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 3: SQL Runner */}
      {activeSubTab === 'query' && (
        <div className="space-y-4">
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                PostgreSQL Query Playground (bharat_social)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSqlInput('SELECT * FROM creator_earnings ORDER BY total_earned_paise DESC;')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Preset: Creator Earnings
                </button>
                <span className="text-slate-700">·</span>
                <button
                  onClick={() => setSqlInput('SELECT * FROM gift_transactions ORDER BY created_at DESC;')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Preset: Gift Transactions
                </button>
                <span className="text-slate-700">·</span>
                <button
                  onClick={() => setSqlInput('SELECT * FROM withdrawals;')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Preset: Payouts & TDS
                </button>
                <span className="text-slate-700">·</span>
                <button
                  onClick={() => setSqlInput('SELECT * FROM stories WHERE expires_at > NOW();')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Preset: Active Stories
                </button>
              </div>
            </div>

            <textarea
              rows={3}
              value={sqlInput}
              onChange={(e) => setSqlInput(e.target.value)}
              className="w-full p-3 bg-slate-950 text-blue-300 font-mono text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500/60 resize-y"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Executing in memory against 20 tables & triggers
              </span>
              <button
                onClick={handleRunQuery}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Execute Query</span>
              </button>
            </div>
          </div>

          {/* Results Display */}
          {queryResult && (
            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800 font-mono">
                <span className="text-slate-300">
                  Result: <span className="tabular-nums font-bold text-white">{queryResult.rows.length}</span> rows returned
                </span>
                <span className="text-emerald-400 tabular-nums">
                  Execution time: {queryResult.durationMs}ms
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      {queryResult.columns.map((c) => (
                        <th key={c} className="px-3.5 py-2.5 whitespace-nowrap">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {queryResult.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        {row.map((val, cellIdx) => (
                          <td key={cellIdx} className="px-3.5 py-2 text-slate-300 whitespace-nowrap tabular-nums max-w-sm truncate">
                            {val === null ? <span className="text-slate-600 italic">null</span> : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View 4: init.sql Generator & Viewer */}
      {activeSubTab === 'initsql' && (
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-400" />
                Complete Bharat Social Media Schema (`./init.sql`)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mounted to `/docker-entrypoint-initdb.d/init.sql` (20 Tables, Indices, Triggers & Sample Data)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyInitSql}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied to Clipboard' : 'Copy SQL'}</span>
              </button>
              <button
                onClick={handleDownloadInitSql}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download init.sql</span>
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-950 text-slate-300 text-xs font-mono rounded-xl border border-slate-800/80 overflow-x-auto max-h-[500px] leading-relaxed">
            {INIT_SQL_TEMPLATE}
          </pre>
        </div>
      )}
    </div>
  );
};
