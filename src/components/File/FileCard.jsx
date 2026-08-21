import React from 'react';

const FileCard = ({ file, onDelete, onViewHistory }) => {
  return (
    <div className="bg-[#0f224a] text-white p-5 rounded-2xl border border-blue-900/40 shadow-lg hover:shadow-xl hover:border-sky-500/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-sky-500/10 rounded-full blur-xl group-hover:bg-sky-400/20 transition-all duration-300 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-sky-500/20 text-sky-300 rounded-xl text-xl flex items-center justify-center border border-sky-400/20">
            📄
          </div>
          <div className="overflow-hidden flex-1">
            <p className="font-bold text-white text-base truncate tracking-wide" title={file.name}>
              {file.name}
            </p>
            <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 bg-sky-900/50 text-sky-200 rounded-md border border-sky-700/30">
              {file.type} • {file.size}
            </span>
          </div>
        </div>

        {/* Uploader Meta */}
        <div className="mt-4 pt-3 border-t border-blue-800/50 text-xs text-slate-300">
          <p>
            Uploaded by{' '}
            <span className="font-semibold text-yellow-300">{file.uploadedBy}</span>
          </p>
          <p className="text-slate-400 mt-0.5">{file.uploadedAt}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center gap-2 relative z-10">
        <button
          onClick={() => onViewHistory(file)}
          className="flex-1 py-2 text-xs bg-blue-900/60 hover:bg-blue-800/80 text-sky-200 rounded-xl font-medium border border-sky-500/20 transition-all duration-200 active:scale-95"
        >
          History ({file.versions?.length || 1})
        </button>
        <button
          onClick={() => alert(`Downloading ${file.name}`)}
          className="flex-1 py-2 text-xs bg-yellow-300 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl transition-all duration-200 shadow-sm active:scale-95"
        >
          Download
        </button>
        <button
          onClick={() => onDelete(file.id)}
          className="p-2 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-500/30 transition-all duration-200 active:scale-95"
          title="Delete file"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default FileCard;