export default function MatchingResultLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* 헤더 스켈레톤 */}
      <header className="fixed top-0 left-0 right-0 bg-white z-10 border-b border-slate-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-slate-200 rounded"></div>
            <div className="h-6 w-24 bg-slate-200 rounded"></div>
          </div>
          <div className="w-6 h-6 bg-slate-200 rounded"></div>
        </div>
        <div className="px-4 pb-4">
          <div className="h-4 w-48 bg-slate-200 rounded"></div>
        </div>
      </header>

      {/* 메인 컨텐츠 스켈레톤 */}
      <div className="pt-24 px-4 pb-24">
        {/* 매니저 정보 카드 스켈레톤 */}
        <div className="bg-white rounded-xl border-2 border-emerald-500 p-4 mb-6 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="h-6 bg-slate-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-48 mb-2"></div>
                </div>
                <div className="h-6 w-20 bg-emerald-500 rounded-full"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-24 mt-1"></div>
              <div className="h-4 bg-slate-200 rounded w-full mt-2"></div>
            </div>
          </div>
        </div>

        {/* 예약 정보 스켈레톤 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-slate-200 rounded"></div>
            <div className="h-6 bg-slate-200 rounded w-24"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="h-4 bg-slate-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 유료 옵션 스켈레톤 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-slate-200 rounded"></div>
            <div className="h-6 bg-slate-200 rounded w-24"></div>
          </div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="h-4 bg-slate-200 rounded w-20"></div>
              </div>
            ))}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <div className="h-5 bg-slate-200 rounded w-16"></div>
                <div className="h-5 bg-slate-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 매니저 메시지 스켈레톤 */}
        <div className="bg-emerald-50 rounded-lg border border-emerald-500 p-4 animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-emerald-200 rounded"></div>
            <div className="h-4 bg-emerald-200 rounded w-24"></div>
          </div>
          <div className="h-20 bg-emerald-200 rounded"></div>
        </div>
      </div>

      {/* 하단 버튼 스켈레톤 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200">
        <div className="flex gap-3">
          <div className="flex-1 h-[52px] bg-slate-100 rounded-lg border border-slate-200"></div>
          <div className="flex-1 h-[52px] bg-[#4ABED9] rounded-lg"></div>
        </div>
      </div>
    </main>
  );
} 