'use client';

import { useRouter } from 'next/navigation';

interface CommonHeaderProps {
  title: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  rightContent?: React.ReactNode;
  subtitle?: string;
}

export const CommonHeader = ({
  title,
  showBackButton = false,
  showCloseButton = false,
  onBack,
  onClose,
  rightContent,
  subtitle
}: CommonHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-2">
        {showBackButton && (
          <button 
            onClick={handleBack}
            className="text-[20px] text-gray-700 hover:text-gray-900"
          >
            ←
          </button>
        )}
        {showCloseButton && (
          <button 
            onClick={handleClose}
            className="text-[20px] text-gray-700 hover:text-gray-900"
          >
            ✕
          </button>
        )}
        {!showBackButton && !showCloseButton && <div className="w-5 h-5" />}
        
        <div className="flex flex-col items-center flex-1">
          <h1 className="text-[17px] font-semibold font-[Apple_SD_Gothic_Neo]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {rightContent ? rightContent : <div className="w-5 h-5" />}
      </div>
    </div>
  );
}; 