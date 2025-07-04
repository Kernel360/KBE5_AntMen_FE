'use client'

import { TodayBenefitsSection } from '@/features/today-benefits/ui/TodayBenefitsSection'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { useRouter } from 'next/navigation'
import { FaQuestionCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa'

export default function EventsPage() {
  const router = useRouter()

  const handleClose = () => {
    router.back()
  }

  const handleContactClick = () => {
    router.push('/boards?t=i')
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <CommonHeader 
        title="이벤트" 
        showCloseButton
        onClose={handleClose}
      />
      <div className="pt-16 flex-1">
      <div className="h-4"></div>
        <TodayBenefitsSection />
        
        {/* 이벤트 안내문 */}
        <section className="px-5 py-6 bg-gray-50 mx-5 rounded-xl mt-2">
          <div className="flex items-center mb-3">
            <FaInfoCircle className="text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">이벤트 참여 방법</h2>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• 이벤트 카드를 클릭하여 바로 서비스를 예약해보세요</p>
            <p>• 첫 이용 시 특별 할인 혜택을 받을 수 있습니다</p>
            <p>• 서비스 이용 후 리뷰 작성 시 포인트를 적립해드립니다</p>
          </div>
        </section>

        {/* 주의사항 */}
        <section className="px-5 py-6 bg-amber-50 mx-5 rounded-xl mt-4">
          <div className="flex items-center mb-3">
            <FaExclamationTriangle className="text-amber-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">주의사항</h2>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• 일부 지역은 서비스 제공이 어려울 수 있습니다</p>
            <p>• 이벤트는 예고 없이 종료될 수 있습니다</p>
          </div>
        </section>

        {/* 문의하기 버튼 */}
        <div className="px-5 mt-4">
          <button
            onClick={handleContactClick}
            className="w-full bg-white border border-gray-200 rounded-xl py-4 px-4 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <FaQuestionCircle className="text-gray-400 mr-3" />
            <span className="text-gray-700 font-medium">이벤트 관련 문의하기</span>
          </button>
        </div>
        {/* 하단 여백 */}
        <div className="h-4"></div>
      </div>
    </div>
  )
}
