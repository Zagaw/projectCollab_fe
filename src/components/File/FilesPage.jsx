import React, { useState } from 'react';
import FileList from './FileList';
import FileUpload from './FileUpload';
import FileVersionHistory from './FileVersionHistory';

const FilesPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([
    {
      id: '1',
      name: 'Project_Proposal.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'Student User',
      uploadedAt: 'Aug 21, 2026',
      versions: [
        { versionNumber: 1, uploadedAt: 'Aug 20, 2026', uploadedBy: 'Student User', size: '2.1 MB' },
        { versionNumber: 2, uploadedAt: 'Aug 21, 2026', uploadedBy: 'Student User', size: '2.4 MB' },
      ],
    },
  ]);

  const handleUploadSuccess = (newFile) => {
    setFiles((prev) => [newFile, ...prev]);
  };

  const handleDelete = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
  };

  const handleViewHistory = (file) => {
    setSelectedFile(file);
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#6FB8E6]/30 border-t-[#1B3A68] rounded-full animate-spin"></div>
          <div className="absolute text-[#ECB44D] text-xl">✦</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef3f8] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Hero Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1B3A68] via-[#244a7c] to-[#191939] p-6 sm:p-8 shadow-[0_20px_50px_rgba(27,58,104,0.25)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        {/* Decorative Sparkles & Ambient Circles */}
        <div className="absolute top-5 left-[35%] text-[#FEF199] text-lg animate-pulse">
          ✦
        </div>
        <div className="absolute top-10 right-10 text-[#6FB8E6] text-xl">
          ✧
        </div>
        <div className="absolute bottom-6 right-[25%] text-[#ECB44D]">
          ✦
        </div>
        <div className="absolute bottom-10 left-[45%] text-[#FEF199] text-sm">
          ✧
        </div>

        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border-[35px] border-[#6FB8E6]/10"></div>
        <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-[#191939]/20"></div>

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#FEF199] flex items-center justify-center shadow-md">
              <span className="text-[#1B3A68] text-base font-bold">✦</span>
            </div>
            <div>
              <p className="text-[#FEF199] text-xs tracking-[0.25em] font-bold">
                FILES WORKSPACE
              </p>
              <p className="text-white/60 text-xs">Collabora Storage</p>
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-wide">
            File Management <span className="text-[#FEF199]">✦</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/70 max-w-xl">
            Upload, organize, and inspect historical revisions of all project documents in one place.
          </p>
        </div>

        {/* Upload Action Button Wrapper */}
        <div className="relative z-10 shrink-0">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      </div>

      {/* Clean Summary Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Files Card (Navy Blue) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B3A68] to-[#244a7c] p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-white/60 uppercase">TOTAL FILES</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-white">{files.length}</p>
            <p className="text-xs text-[#FEF199] mt-1">Active items →</p>
          </div>
        </div>

        {/* Storage Used Card (Sky Blue) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6FB8E6] to-[#8cccf0] p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-[#1B3A68]/70 uppercase">STORAGE</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-[#1B3A68]">2.4 MB</p>
            <p className="text-xs font-bold text-[#1B3A68] mt-1">Storage used →</p>
          </div>
        </div>

        {/* Recent Uploads Card (Warm Gold) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ECB44D] to-[#f5c96c] p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-[#1B3A68]/70 uppercase">UPLOADS</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-[#1B3A68]">1</p>
            <p className="text-xs font-bold text-[#1B3A68] mt-1">This week →</p>
          </div>
        </div>

        {/* Revisions Card (Midnight Blue / Purple) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#191939] to-[#303060] p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-white/60 uppercase">REVISIONS</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-white">
              {files.reduce((acc, curr) => acc + (curr.versions?.length || 1), 0)}
            </p>
            <p className="text-xs text-[#6FB8E6] mt-1">Versions logged →</p>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* All Files Main Container */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] shadow-[0_15px_40px_rgba(27,58,104,0.08)] border border-[#1B3A68]/5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs tracking-[0.2em] text-[#ECB44D] font-bold">RESOURCES</p>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B3A68] mt-1">All Documents</h2>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#1B3A68] flex items-center justify-center text-[#FEF199] font-bold shadow-md">
              ✦
            </div>
          </div>
          <FileList
            files={files}
            onDelete={handleDelete}
            onViewHistory={handleViewHistory}
          />
        </div>

        {/* Version History Inspector Card */}
        <div className="relative overflow-hidden rounded-[2rem] bg-[#1B3A68] text-white p-6 shadow-[0_20px_45px_rgba(27,58,104,0.22)] flex flex-col justify-between">
          <div className="absolute top-3 right-6 text-[#FEF199] text-lg">✦</div>
          <div className="absolute bottom-5 left-5 text-[#6FB8E6] text-sm">✧</div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[#FEF199] text-xs tracking-[0.18em] font-bold">INSPECTOR</p>
                <h2 className="text-xl font-bold text-white mt-1">Version History</h2>
              </div>
            </div>
            
            <div className="bg-white/10 border border-white/10 backdrop-blur-sm rounded-2xl p-4">
              <FileVersionHistory file={selectedFile} />
            </div>
          </div>

          <div className="relative z-10 mt-6">
            <button 
              onClick={() => setSelectedFile(null)}
              className="w-full py-3 bg-[#FEF199] hover:bg-white text-[#1B3A68] font-bold rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-md active:scale-95 hover:shadow-[0_0_25px_rgba(254,241,153,0.45)]"
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="flex items-center justify-center gap-3 mt-8 pb-4 text-xs text-[#1B3A68]/60">
        <span className="text-[#ECB44D]">✦</span>
        <span>COLLABORATE</span>
        <span className="w-1 h-1 rounded-full bg-[#6FB8E6]"></span>
        <span>CREATE</span>
        <span className="w-1 h-1 rounded-full bg-[#ECB44D]"></span>
        <span>CONNECT</span>
        <span className="text-[#6FB8E6]">✧</span>
      </div>
    </div>
  );
};

export default FilesPage;