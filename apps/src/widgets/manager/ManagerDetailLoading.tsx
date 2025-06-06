export const ManagerDetailLoading = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[420px] mx-auto animate-pulse">
        {/* 헤더 스켈레톤 */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-32 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
        </header>

        {/* 프로필 섹션 스켈레톤 */}
        <section className="px-5 py-8 text-center border-b border-gray-100">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full"></div>
          <div className="w-48 h-7 bg-gray-200 rounded mx-auto mb-2"></div>
          <div className="w-24 h-4 bg-gray-200 rounded mx-auto mb-4"></div>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-5 h-5 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="w-12 h-5 bg-gray-200 rounded ml-2"></div>
          </div>
          <div className="w-20 h-4 bg-gray-200 rounded mx-auto"></div>
        </section>

        {/* 자기소개 스켈레톤 */}
        <section className="px-5 py-6 border-b border-gray-100">
          <div className="w-16 h-5 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
          </div>
        </section>

        {/* 성격 특징 스켈레톤 */}
        <section className="px-5 py-6 border-b border-gray-100">
          <div className="w-16 h-5 bg-gray-200 rounded mb-4"></div>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-8 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </section>

        {/* 고객 리뷰 스켈레톤 */}
        <section className="px-5 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-5 bg-gray-200 rounded"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
          </div>
          
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-4 bg-gray-200 rounded"></div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 mb-2">
                  <div className="w-full h-3 bg-gray-200 rounded"></div>
                  <div className="w-4/5 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 버튼 스켈레톤 */}
        <div className="px-5 py-6 border-t border-gray-100">
          <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}; 