import { HomeHeader } from "@/features/home/ui/HomeHeader";
import { CategorySection } from "@/features/home/ui/CategorySection";
import { NoticeSection } from "@/features/home/ui/NoticeSection";
import { BanknotesIcon } from '@heroicons/react/24/outline';

export default function ManagerHomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HomeHeader 
        title='앤트워커로 달라지는 일상'
        subtitle='바쁜 일상에서 효율적으로 일해보아요'
        buttonLabel='급여 확인하기'
        IconComponent={<BanknotesIcon className="w-6 h-6 text-black" />}  
      />
      <CategorySection />
      <NoticeSection />
    </main>
  );
}
