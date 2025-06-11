import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '더보기 | AntMen',
  description: 'AntMen 매니저 더보기 페이지',
};

export default function ManagerMorePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">더보기</h1>
      <div className="space-y-4">
        {/* 여기에 더보기 메뉴 아이템들을 추가할 수 있습니다 */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">계정 설정</h2>
          <p className="text-gray-600">프로필 및 계정 정보를 관리합니다.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">알림 설정</h2>
          <p className="text-gray-600">알림 수신 설정을 관리합니다.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">고객 지원</h2>
          <p className="text-gray-600">문의사항 및 도움말을 확인합니다.</p>
        </div>
      </div>
    </main>
  );
}
