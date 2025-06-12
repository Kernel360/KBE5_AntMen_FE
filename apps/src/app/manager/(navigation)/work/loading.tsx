const ManagerWorkLoadingPage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 스켈레톤 */}
      <header className="flex items-center justify-between p-5">
        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-6" />
      </header>

      {/* 콘텐츠 */}
      <div className="px-5 pb-6">
        {/* 탭 스켈레톤 */}
        <section className="mb-4">
          <div className="flex gap-10">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </section>

        {/* 카드 스켈레톤 */}
        <section className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <article key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              {/* 헤더 스켈레톤 */}
              <header className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-6 w-12 bg-gray-200 rounded-xl animate-pulse" />
              </header>

              {/* 상세 정보 스켈레톤 */}
              <section className="space-y-2 mb-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </section>

              {/* 버튼 스켈레톤 */}
              <footer className="flex gap-3">
                <div className="flex-1 h-11 bg-gray-200 rounded-[22px] animate-pulse" />
                <div className="flex-1 h-11 bg-gray-200 rounded-[22px] animate-pulse" />
              </footer>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default ManagerWorkLoadingPage; 