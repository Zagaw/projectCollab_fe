import React from 'react';
import FileCard from './FileCard';

const FileList = ({ files = [], onDelete, onViewHistory }) => {
  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-[#0b1736]/60 border border-blue-900/30 text-slate-400">
        <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center text-3xl mb-3 border border-sky-500/20 text-yellow-300">
          ✨
        </div>
        <p className="text-base font-medium text-slate-200">No files uploaded yet</p>
        <p className="text-xs text-slate-400 mt-1">Upload your first document to see it listed here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onDelete={onDelete}
          onViewHistory={onViewHistory}
        />
      ))}
    </div>
  );
};

export default FileList;