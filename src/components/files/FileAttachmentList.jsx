import React, { useState } from 'react';
import FileAttachment from './FileAttachment';
import FilePreviewModal from './FilePreviewModal';

const FileAttachmentList = ({ files, onDelete, showDelete = true }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  if (!files || files.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-3 space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Attachments ({files.length})
        </p>
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.fileId} onClick={() => setSelectedFile(file)} className="cursor-pointer">
              <FileAttachment
                file={file}
                onDelete={onDelete}
                showDelete={showDelete}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </>
  );
};

export default FileAttachmentList;