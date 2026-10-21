import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HardDrive, 
  Folder, 
  UploadCloud, 
  Link, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  Film, 
  Image as ImageIcon 
} from 'lucide-react';

export const MinioExplorer: React.FC = () => {
  const { minioObjects, uploadMinioFile } = useApp();
  const [selectedBucket, setSelectedBucket] = useState<string>('bharat-posts-images');
  const [presignExpiry, setPresignExpiry] = useState<number>(15);
  const [generatedPresignedUrl, setGeneratedPresignedUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const buckets = [
    { name: 'bharat-posts-images', desc: 'Feed image attachments (PNG, WebP, JPG)', access: 'Public Read' },
    { name: 'bharat-reels-video', desc: 'Reels and short video clips (MP4, HLS)', access: 'Public Read' },
    { name: 'bharat-avatars', desc: 'User profile pictures & banners', access: 'Public Read' },
    { name: 'bharat-documents', desc: 'Private verification KYC docs', access: 'Private' }
  ];

  const filteredObjects = minioObjects.filter((obj) => obj.bucket === selectedBucket);

  const handleGeneratePresigned = (objectName?: string) => {
    const target = objectName || `${selectedBucket}/upload_${Date.now()}.webp`;
    const url = `http://localhost:9000/${target}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20261021%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261021T114400Z&X-Amz-Expires=${presignExpiry * 60}&X-Amz-SignedHeaders=host&X-Amz-Signature=89f3a1e0b5712e9c`;
    setGeneratedPresignedUrl(url);
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      const mime = uploadFileName.endsWith('.mp4') ? 'video/mp4' : 'image/webp';
      const size = Math.floor(Math.random() * 800000 + 120000);
      uploadMinioFile(selectedBucket, uploadFileName.trim(), size, mime);
      setUploadFileName('');
      setIsUploading(false);
    }, 600);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* MinIO Service Header Card */}
      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <HardDrive className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">MinIO Object Storage (bharat_minio)</h2>
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Healthy (S3 API: 9000 · Console: 9001)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              USER: minioadmin · PASS: minioadmin123 · S3 COMPATIBLE
            </p>
          </div>
        </div>

        {/* Quick Console Link */}
        <div className="flex items-center gap-2 text-xs">
          <a
            href="http://localhost:9001"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Open MinIO Console (:9001)</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Buckets List Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">
            S3 Buckets ({buckets.length})
          </p>

          {buckets.map((b) => {
            const isSelected = b.name === selectedBucket;
            const objCount = minioObjects.filter((o) => o.bucket === b.name).length;
            return (
              <div
                key={b.name}
                onClick={() => setSelectedBucket(b.name)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-amber-500/50 shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm font-semibold text-white flex items-center gap-1.5">
                    <Folder className="w-4 h-4 text-amber-400" />
                    {b.name}
                  </span>
                  <span className="text-xs font-mono tabular-nums text-slate-400">
                    {objCount} objs
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{b.desc}</p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span>Policy: {b.access}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bucket Content & Upload Sandbox (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Direct Upload Form */}
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-amber-400" />
              Direct Upload Simulator ({selectedBucket})
            </h3>

            <form onSubmit={handleSimulateUpload} className="flex gap-2">
              <input
                type="text"
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                placeholder="File name (e.g. kashi_sunset_4k.webp or reel_blr_tech.mp4)"
                className="flex-1 px-3 py-1.5 bg-slate-950 font-mono text-xs rounded-lg border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
              />
              <button
                type="submit"
                disabled={isUploading || !uploadFileName.trim()}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                {isUploading ? 'Uploading...' : 'Upload to S3'}
              </button>
            </form>
          </div>

          {/* Objects Table */}
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-mono text-slate-300">
                Bucket Objects: <span className="text-white font-bold">{filteredObjects.length}</span>
              </span>
              <button
                onClick={() => handleGeneratePresigned()}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium"
              >
                <Link className="w-3.5 h-3.5" />
                <span>Create Presigned PUT URL</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-3.5 py-2.5">Object Key</th>
                    <th className="px-3 py-2.5">Size</th>
                    <th className="px-3 py-2.5">MIME Type</th>
                    <th className="px-3 py-2.5">Modified</th>
                    <th className="px-3 py-2.5 text-right">Presign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredObjects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No objects in this bucket yet. Upload above or trigger via social feed!
                      </td>
                    </tr>
                  ) : (
                    filteredObjects.map((obj) => {
                      const isVideo = obj.mimeType.includes('video');
                      return (
                        <tr key={obj.name} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-3.5 py-2.5 text-slate-200 flex items-center gap-2 max-w-xs truncate">
                            {isVideo ? (
                              <Film className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            )}
                            <span className="truncate">{obj.name.replace(`${obj.bucket}/`, '')}</span>
                          </td>
                          <td className="px-3 py-2.5 text-slate-400 tabular-nums">
                            {(obj.size / 1024).toFixed(1)} KB
                          </td>
                          <td className="px-3 py-2.5 text-slate-400">{obj.mimeType}</td>
                          <td className="px-3 py-2.5 text-slate-400 tabular-nums">{obj.lastModified}</td>
                          <td className="px-3 py-2.5 text-right">
                            <button
                              onClick={() => handleGeneratePresigned(obj.name)}
                              className="text-slate-400 hover:text-amber-400 transition-colors p-1 cursor-pointer"
                              title="Generate presigned GET URL"
                            >
                              <Link className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Generated Presigned URL Box */}
          {generatedPresignedUrl && (
            <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/40 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5" />
                  AWS SigV4 Presigned URL (Valid for {presignExpiry} mins)
                </span>
                <button
                  onClick={() => handleCopyUrl(generatedPresignedUrl)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-2.5 bg-slate-900 rounded font-mono text-[11px] text-slate-300 break-all">
                {generatedPresignedUrl}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
