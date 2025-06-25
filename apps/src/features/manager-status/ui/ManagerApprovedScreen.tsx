'use client'

interface ManagerApprovedScreenProps {
  managerName: string
  onContinue: () => void
}

export const ManagerApprovedScreen = ({ 
  managerName, 
  onContinue 
}: ManagerApprovedScreenProps) => {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-[375px] px-4 pt-4 pb-8">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-screen space-y-6 pt-16">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            🎉 축하합니다!
          </h1>

          {/* Description */}
          <div className="space-y-4 text-center">
            <p className="text-gray-600 text-base leading-relaxed">
              매니저 승인이 완료되었습니다!<br />
              이제 청소 서비스를 제공하며 수익을 창출하실 수 있습니다.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-green-900 mb-2">✨ 매니저 혜택</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• 실시간 예약 요청 수신</li>
                <li>• 유연한 근무 시간 설정</li>
                <li>• 투명한 수수료 정책</li>
                <li>• 고객 리뷰 관리 시스템</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">🚀 시작하기</h3>
              <p className="text-sm text-blue-800">
                매니저 전용 대시보드에서 예약 요청을 확인하고<br />
                고객과의 매칭을 시작하세요!
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full space-y-3 mt-8">
            <button
              onClick={onContinue}
              className="w-full h-[52px] bg-primary text-white rounded-lg text-base font-medium hover:bg-primary/90 transition-colors"
            >
              매니저 활동 시작하기 🚀
            </button>
          </div>

          {/* Contact Info */}
          <div className="text-center text-sm text-gray-500 mt-6">
            <p>문의사항이 있으시면</p>
            <p className="font-semibold text-primary">고객센터 1588-0000</p>
            <p>으로 연락해 주세요</p>
          </div>
        </div>
      </div>
    </div>
  )
} 