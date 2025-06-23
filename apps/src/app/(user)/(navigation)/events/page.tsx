'use client';

import { CommonHeader } from '@/shared/ui/Header/CommonHeader';
import UnderConstruction from "@/shared/ui/UnderConstruction";
import { useRouter } from 'next/navigation';

export default function EventsPage() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <CommonHeader 
        title="이벤트 🎁" 
        showCloseButton
        onClose={handleClose}
      />
      <div className="pt-16 flex-1">
        <UnderConstruction 
          message="준비된 이벤트가 없습니다 😢<br><br>빠른 시일내로 돌아오겠습니다 ✨"
        />
      </div>
    </div>
  );
}
