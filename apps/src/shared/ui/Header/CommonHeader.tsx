'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

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

  const handleNavigation = () => {
    if (onBack) {
      onBack();
    } else if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-mobile bg-white border-b border-gray-200 shadow-sm">
      <div className="h-[64px] flex items-stretch relative">
        {/* Left Section - Fixed width */}
        <div className="absolute left-0 w-[48px] h-[64px] flex items-center justify-start pl-4">
          {showBackButton && (
            <button 
              onClick={handleNavigation}
              className="inline-flex items-center justify-center text-gray-700 transition-all duration-200 ease-in-out hover:scale-125 hover:text-gray-600/85"
            >
              <ArrowLeftIcon className="w-6 h-6" style={{ strokeWidth: 1.5 }} />
            </button>
          )}
          {showCloseButton && (
            <button 
              onClick={handleNavigation}
              className="inline-flex items-center justify-center text-gray-700 transition-all duration-200 ease-in-out hover:scale-125 hover:text-gray-600/85"
            >
              <XMarkIcon className="w-6 h-6" style={{ strokeWidth: 1.5 }} />
            </button>
          )}
        </div>

        {/* Center Section - Full width for true center alignment */}
        <div className="w-full h-[64px] flex flex-col items-center justify-center mx-[48px]">
          <h1 className={`font-semibold font-[Apple_SD_Gothic_Neo] leading-normal ${
            subtitle ? 'text-[18px]' : 'text-[20px]'
          }`}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 leading-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Section - Fixed width */}
        <div className="absolute right-0 w-[48px] h-[64px] flex items-center justify-end pr-4">
          {rightContent}
        </div>
      </div>
    </div>
  );
}; 