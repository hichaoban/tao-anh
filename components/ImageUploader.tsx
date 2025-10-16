
import React, { useState, useRef, useCallback } from 'react';

interface ImageUploaderProps {
  id: string;
  title: string;
  onImageUpload: (file: File) => void;
}

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, onImageUpload }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      setFileName(file.name);
      onImageUpload(file);
    }
  }, [onImageUpload, previewUrl]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{title}</label>
      <div 
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md cursor-pointer hover:border-amber-500 dark:hover:border-amber-400 transition-colors"
        onClick={handleClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            if (fileInputRef.current) {
              fileInputRef.current.files = e.dataTransfer.files;
              handleFileChange({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>);
            }
          }
        }}
      >
        <div className="space-y-1 text-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="mx-auto h-24 w-24 object-cover rounded-md" />
          ) : (
            <UploadIcon />
          )}
          <div className="flex text-sm text-gray-600 dark:text-gray-400">
            <p className="relative bg-white dark:bg-gray-900 rounded-md font-medium text-amber-500 dark:text-amber-400 hover:text-amber-300">
              <span>{fileName ? 'Thay đổi ảnh' : 'Tải lên một tệp'}</span>
            </p>
            <input id={id} name={id} type="file" className="sr-only" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">{fileName ? fileName : 'Kéo và thả'}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
