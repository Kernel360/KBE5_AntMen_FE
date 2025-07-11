'use client';

import { CommonHeader } from '@/shared/ui/Header/CommonHeader';
import UnderConstruction from "@/shared/ui/UnderConstruction";
import { useRouter } from 'next/navigation';

interface UnderConstructionPageProps {
  title: string;
  emoji: string;
  featureName: string;
}

export const UnderConstructionPage = ({
  title,
  emoji,
  featureName,
}: UnderConstructionPageProps) => {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <CommonHeader 
        title={`${title} ${emoji}`}
        showCloseButton
      />
      <div className="pt-16 flex-1">
        <UnderConstruction 
          message={`${featureName} 기능을 준비중입니다 😊<br><br>빠른 시일내로 돌아오겠습니다 ✨`}
        />
      </div>
    </div>
  );
}; 