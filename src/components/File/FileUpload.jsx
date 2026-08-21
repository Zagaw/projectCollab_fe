import React, { useState } from 'react';

const FileUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    // Simulate upload process
    setTimeout(() => {
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type || 'FILE',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: 'Student',
        uploadedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        versions: [
          {
            versionNumber: 1,
            uploadedAt: 'Just now',
            uploadedBy: 'Student',
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          },
        ],
      };

      setUploading(false);
      if (onUploadSuccess) onUploadSuccess(newFile);
    }, 1000);
  };

  return (
    <div>
      <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FEF199] text-[#1B3A68] font-bold text-xs sm:text-sm hover:bg-white hover:shadow-[0_0_25px_rgba(254,241,153,0.45)] transition-all duration-300">
        <span>{uploading ? 'Uploading...' : '✦ Upload File'}</span>
        <input
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default FileUpload;