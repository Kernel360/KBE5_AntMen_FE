// 매니저가 매칭 요청을 검토하는 페이지 (Figma: Matching Request Review)

import Link from 'next/link';

const mockData = {
  service: {
    name: '기본 청소',
    desc: '일반 가정집 청소 서비스',
    date: '2024년 2월 15일 (목) 오전 10:00 ~ 오후 2:00',
  },
  location: {
    address1: '서울시 강남구 역삼동 123-45',
    address2: '테헤란로 123길 45, 3층',
  },
  house: ['방 2개', '욕실 1개', '거실 1개'],
  options: [
    { name: '냉장고 청소', price: 15000 },
    { name: '오븐 청소', price: 10000 },
  ],
  notes: '반려동물(강아지 1마리)이 있습니다. 청소 시 주의해주세요.',
};

export default function ManagerMatchingRequestPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="w-full max-w-[375px] mx-auto flex flex-col min-h-screen">
        {/* 헤더 */}
        <header className="bg-white border-b border-slate-200 px-5 pt-7 pb-4">
          <div className="flex items-center justify-between">
            <Link href="/matching" className="text-slate-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">매칭 요청 검토</h1>
            <button className="text-slate-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="2"/>
                <circle cx="19" cy="12" r="2"/>
                <circle cx="5" cy="12" r="2"/>
              </svg>
            </button>
          </div>
          <p className="pt-2 text-sm text-slate-500">고객의 서비스 요청을 확인해주세요</p>
        </header>

        {/* 본문 */}
        <div className="flex-1 px-5 py-6 space-y-5">
          {/* 서비스 정보 */}
          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4abed9">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{mockData.service.name}</h2>
                <p className="text-sm text-slate-500">{mockData.service.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#64748b">
                <rect x="3" y="4" width="14" height="13" rx="2" strokeWidth="2"/>
                <path d="M16 7H4" strokeWidth="2"/>
              </svg>
              <span className="text-[15px] font-medium text-slate-700">{mockData.service.date}</span>
            </div>
          </section>

          {/* 주소 정보 */}
          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#64748b">
                <path d="M10 18s6-5.686 6-10A6 6 0 104 8c0 4.314 6 10 6 10z" strokeWidth="2"/>
              </svg>
              <h3 className="text-base font-semibold text-slate-900">주소 정보</h3>
            </div>
            <div className="text-[15px] font-medium text-slate-700">{mockData.location.address1}</div>
            <div className="text-sm text-slate-500 mt-1">{mockData.location.address2}</div>
          </section>

          {/* 집 구조 */}
          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#64748b">
                <rect x="3" y="7" width="14" height="10" rx="2" strokeWidth="2"/>
                <path d="M7 7V3h6v4" strokeWidth="2"/>
              </svg>
              <h3 className="text-base font-semibold text-slate-900">집 구조</h3>
            </div>
            <div className="flex gap-2 mt-2">
              {mockData.house.map((item, i) => (
                <span key={i} className="bg-slate-50 text-slate-700 text-sm font-medium rounded-lg px-3 py-1 border border-slate-200">{item}</span>
              ))}
            </div>
          </section>

          {/* 유료 옵션 */}
          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#64748b">
                <path d="M10 3v14m7-7H3" strokeWidth="2"/>
              </svg>
              <h3 className="text-base font-semibold text-slate-900">선택한 유료 옵션</h3>
            </div>
            <div className="space-y-2 mt-2">
              {mockData.options.map((opt, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-[15px] font-medium text-slate-700">{opt.name}</span>
                  <span className="text-sm font-semibold text-blue-500">+{opt.price.toLocaleString()}원</span>
                </div>
              ))}
            </div>
          </section>

          {/* 특이사항 */}
          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#64748b">
                <rect x="3" y="3" width="14" height="14" rx="2" strokeWidth="2"/>
                <path d="M7 7h6v6H7z" strokeWidth="2"/>
              </svg>
              <h3 className="text-base font-semibold text-slate-900">특이사항</h3>
            </div>
            <p className="text-[15px] text-slate-700 mt-2 leading-relaxed">{mockData.notes}</p>
          </section>

          {/* 메시지 입력 */}
          <section>
            <label className="block text-[15px] font-medium text-slate-900 mb-2">메시지 (선택사항)</label>
            <textarea
              className="w-full min-h-[80px] rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4abed9] resize-none"
              placeholder="고객에게 전달할 메시지를 입력하세요"
            />
          </section>
        </div>

        {/* 하단 버튼 */}
        <div className="bg-white border-t border-slate-200 px-5 py-4 flex gap-3">
          <button className="flex-1 py-3.5 rounded-lg bg-slate-50 text-slate-700 font-semibold text-base border border-slate-200">거절</button>
          <button className="flex-1 py-3.5 rounded-lg bg-[#4ABED9] text-white font-semibold text-base">매칭 수락</button>
        </div>
      </div>
    </main>
  );
} 