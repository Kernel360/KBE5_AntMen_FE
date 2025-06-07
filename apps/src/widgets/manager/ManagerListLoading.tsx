export const ManagerListLoading = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] animate-pulse">
      {/* 헤더 스켈레톤 */}
      <div className="bg-white border-b border-[#e2e8f0] px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <div className="w-24 h-6 bg-gray-200 rounded mb-2"></div>
            <div className="w-40 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-12 h-6 bg-gray-200 rounded-xl"></div>
        </div>
      </div>

      {/* 매니저 리스트 스켈레톤 */}
      <div className="p-5 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border-2 border-gray-200">
            <div className="flex gap-4">
              <div className="w-[72px] h-[72px] bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="w-32 h-5 bg-gray-200 rounded"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-full h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 고정 영역 스켈레톤 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
        <div className="p-4">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}; 