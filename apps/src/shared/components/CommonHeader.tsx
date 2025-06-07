'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

interface CommonHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
}

export const CommonHeader = ({
  title,
  showBackButton = true,
  rightContent
}: CommonHeaderProps) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="flex items-center justify-between h-12 px-4">
        <div className="flex items-center gap-2 min-w-0">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="p-1 -ml-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-medium truncate">{title}</h1>
        </div>
        {rightContent && (
          <div className="flex items-center gap-2">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
}; 