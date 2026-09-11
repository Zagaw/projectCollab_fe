import React, { useState, useRef } from 'react';
import { formatFileSize } from '../../utils/helper';

const FileUploader = ({ onFilesSelect, maxFiles = 5, maxSize = 10 * 1024 * 1024 }) => {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFiles) => {
    const validFiles = [];
    const errors = [];

    Array.from(selectedFiles).forEach((file) => {
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds ${formatFileSize(maxSize)} limit`);
        return;
      }
      validFiles.push(file);
    });

    if (errors.length > 0) {
      // Show errors in a toast or alert
      alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      const newFiles = [...files, ...validFiles].slice(0, maxFiles);
      setFiles(newFiles);
      onFilesSelect(newFiles);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelect(newFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileChange(droppedFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="space-y-3">
      <div
        className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
          dragOver
            ? 'border-indigo-600 bg-indigo-50'
            : 'border-gray-200 bg-white hover:border-indigo-200'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Drag and drop files here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-indigo-700 hover:text-indigo-800 font-medium"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Max {maxFiles} files · Max {formatFileSize(maxSize)} each
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              handleFileChange(e.target.files);
              e.target.value = '';
            }
          }}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.json,.xml,.png,.jpg,.jpeg,.gif,.zip,.rar"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 p-3 surface"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="btn-danger !py-1 !px-2 text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
