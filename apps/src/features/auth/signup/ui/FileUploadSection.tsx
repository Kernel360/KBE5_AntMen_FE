import React, { useState, useCallback } from 'react';

interface DragState {
  isDragging: boolean;
  message: string;
}

interface FileUploadSectionProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  error?: string;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  files,
  onFilesChange,
  error,
}) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    message: '파일을 드래그하여 업로드하거나 클릭하여 선택하세요'
  });

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState(prev => ({
      ...prev,
      isDragging: true,
      message: '파일을 여기에 놓아주세요'
    }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState(prev => ({
      ...prev,
      isDragging: false,
      message: '파일을 드래그하여 업로드하거나 클릭하여 선택하세요'
    }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState(prev => ({
      ...prev,
      isDragging: false,
      message: '파일을 드래그하여 업로드하거나 클릭하여 선택하세요'
    }));

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      const validTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
      return validTypes.some(type => file.name.toLowerCase().endsWith(type));
    });

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  }, [files, onFilesChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const handleRemoveAll = () => {
    onFilesChange([]);
  };

  return (
    <div className="space-y-2">
      <label className="block text-base font-medium">신원 확인 서류</label>
      <p className="text-sm text-gray-500 mb-2">여러 개의 파일을 선택할 수 있습니다.</p>
      <div className="space-y-2">
        <input
          type="file"
          id="identityFiles"
          name="identityFiles"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative min-h-[120px] p-4 bg-[#F9F9F9] rounded-lg border-2 border-dashed transition-colors ${
            error 
              ? 'border-red-500 bg-red-50'
              : dragState.isDragging 
                ? 'border-[#0fbcd6] bg-[#F0F9FF]' 
                : 'border-gray-300 hover:border-[#0fbcd6]'
          }`}
        >
          <label 
            htmlFor="identityFiles"
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          >
            <svg 
              className={`w-8 h-8 mb-2 transition-colors ${
                error
                  ? 'text-red-500'
                  : dragState.isDragging 
                    ? 'text-[#0fbcd6]' 
                    : 'text-gray-400'
              }`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
            <span className={`text-sm ${
              error
                ? 'text-red-500'
                : dragState.isDragging 
                  ? 'text-[#0fbcd6]' 
                  : 'text-gray-500'
            }`}>
              {dragState.message}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              (PDF, JPG, JPEG, PNG)
            </span>
          </label>
        </div>
        {error && (
          <span className="text-red-500 text-sm">{error}</span>
        )}
        {files.length > 0 && (
          <div className="mt-2 space-y-2 p-4 bg-[#F9F9F9] rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">선택된 파일 ({files.length})</span>
              <button
                type="button"
                onClick={handleRemoveAll}
                className="text-sm text-red-500 hover:text-red-600"
              >
                전체 삭제
              </button>
            </div>
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 py-2 px-3 bg-white rounded">
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-600 block truncate" title={file.name}>
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-sm text-gray-400 hover:text-red-500 shrink-0"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 