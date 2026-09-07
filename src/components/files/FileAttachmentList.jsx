import React, { useState } from 'react';
import FileAttachment from './FileAttachment';

const FileAttachmentList = ({ files, onDelete, showDelete = true, onVersionUpdated }) => {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        Attachments ({files.length})
      </p>
      <div className="space-y-2">
        {files.map((file) => (
          <FileAttachment
            key={file.fileId}
            file={file}
            onDelete={onDelete}
            showDelete={showDelete}
            onVersionUpdated={onVersionUpdated}
          />
        ))}
      </div>
    </div>
  );
};

export default FileAttachmentList;