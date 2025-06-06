import { CommonHeader } from '@/shared/ui/Header/CommonHeader';

export const BoardHeader = () => {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-white px-4 border-b">
      <CommonHeader title="게시판" showCloseButton />
    </header>
  );
}; 