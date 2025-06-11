import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const Page = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <CheckCircleIcon className="w-16 h-16 text-emerald-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">예약이 완료되었습니다!</h1>
      <p className="text-gray-600 mb-8">예약 내역은 예약 현황에서 확인하실 수 있습니다.</p>
      <div className="flex gap-3">
        <Link href="/" className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition">
          홈으로 돌아가기
        </Link>
        <Link href="/myreservation" className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition">
          예약 현황 보기
        </Link>
      </div>
    </main>
  );
};

export default Page; 