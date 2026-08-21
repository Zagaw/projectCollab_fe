import React from 'react';

const FileVersionHistory = ({ file }) => {
  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-[#0b1736]/60 border border-blue-900/30 text-slate-400">
        <div className="w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center text-2xl mb-3 border border-sky-500/20 text-yellow-300">
          🕒
        </div>
        <p className="text-sm font-medium text-slate-200">No file selected</p>
        <p className="text-xs text-slate-400 mt-1 text-center">
          Click "History" on any file card to view its revision logs.
        </p>
      </div>
    );
  }

  const versions = file.versions || [
    {
      versionNumber: 1,
      uploadedAt: file.uploadedAt,
      uploadedBy: file.uploadedBy,
      size: file.size,
    },
  ];

  return (
    <div className="space-y-4">
      {/* File Details Subheader */}
      <div className="pb-3 border-b border-blue-900/50 flex items-center justify-between">
        <div className="overflow-hidden">
          <h3 className="font-bold text-white text-sm truncate" title={file.name}>
            {file.name}
          </h3>
          <p className="text-xs text-sky-300 mt-0.5">
            Total Versions: <span className="font-semibold text-yellow-300">{versions.length}</span>
          </p>
        </div>
        <span className="p-2 bg-sky-500/10 text-sky-300 rounded-lg text-lg border border-sky-500/20 shrink-0">
          📄
        </span>
      </div>

      {/* Version List */}
      <div className="space-y-3">
        {versions.map((ver, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-[#0b1736] rounded-xl border border-blue-900/50 hover:border-sky-500/30 transition-all duration-200 flex items-center justify-between gap-3 group"
          >
            <div className="space-y-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold bg-sky-500/20 text-sky-200 px-2 py-0.5 rounded-md border border-sky-500/30">
                  v{ver.versionNumber || idx + 1}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {ver.size || file.size}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                By{' '}
                <span className="font-semibold text-yellow-300">
                  {ver.uploadedBy || file.uploadedBy}
                </span>
              </p>
              <p className="text-[11px] text-slate-400">{ver.uploadedAt || file.uploadedAt}</p>
            </div>

            <button
              onClick={() => alert(`Downloading version ${ver.versionNumber || idx + 1}`)}
              className="px-3 py-1.5 text-xs bg-yellow-300 hover:bg-yellow-400 text-slate-900 font-bold rounded-lg transition-all duration-200 shadow-sm active:scale-95 shrink-0"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileVersionHistory;