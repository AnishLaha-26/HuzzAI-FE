import React, { useState, useRef } from 'react';

/**
 * onImageSelect returns:
 *   file  – the File object you can POST with FormData
 *   url   – a blob URL for instant preview
 */
interface Props {
  onImageSelect: (file: File, url: string) => void;
}

export const ImageUploadButton: React.FC<Props> = ({ onImageSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageSelect(file, url);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <button type="button" className="upload-btn" onClick={() => setIsModalOpen(true)}>
        📸 Upload Screenshot
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      {/* Simple modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button type="button" className="option-btn" onClick={openFilePicker}>
              Choose from Library
            </button>
            <button type="button" className="option-btn cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
