import { CommonHeader } from '@/shared/ui/Header/CommonHeader';
import { useRouter } from 'next/navigation';

export const BoardHeader = () => {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <CommonHeader 
      title="게시판" 
      showCloseButton
      onClose={handleClose}
    />
  );
}; 