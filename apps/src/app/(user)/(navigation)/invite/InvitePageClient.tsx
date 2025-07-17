'use client'

import { useState } from 'react'
import { 
  ShareIcon, 
  GiftIcon, 
  UserGroupIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export const InvitePageClient = () => {
  const [showModal, setShowModal] = useState(false)

  const handleKakaoShare = () => {
    alert('준비중입니다!')
  }

  const handleCopyLink = () => {
    const message = '이용해주셔서 감사합니다. 해당기능은 준비중입니다.'
    navigator.clipboard.writeText(message).then(() => {
      alert('링크가 클립보드에 복사되었습니다!')
    })
  }

  const handleDetailClick = () => {
    setShowModal(true)
  }

  const inviteBenefits = [
    {
      icon: <GiftIcon className="w-6 h-6 text-blue-500" />,
      title: '친구 초대 보상',
      description: '친구가 가입하면 5,000원 포인트 지급'
    },
    {
      icon: <UserGroupIcon className="w-6 h-6 text-green-500" />,
      title: '함께 사용하기',
      description: '친구와 함께 더 편리한 생활 시작'
    },
    {
      icon: <ShareIcon className="w-6 h-6 text-purple-500" />,
      title: '간편한 공유',
      description: '카카오톡으로 쉽게 친구에게 공유'
    }
  ]

  return (
    <>
      <div className="flex flex-col bg-gray-50 min-h-screen pt-16 pb-20">
        {/* 메인 초대 섹션 */}
        <section className="bg-white px-5 py-6 mb-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              친구를 초대하고
            </h1>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              포인트를 받아보세요!
            </h2>
            <p className="text-gray-600 text-sm">
              친구가 가입하면 5,000원 포인트를 드려요
            </p>
          </div>

          {/* 초대 버튼들 */}
          <div className="space-y-3">
            <button
              onClick={handleKakaoShare}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              카카오톡으로 친구초대
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors"
            >
              <ShareIcon className="w-6 h-6" />
              링크 복사하기
            </button>
          </div>
        </section>

        {/* 혜택 안내 섹션 */}
        <section className="bg-white px-5 py-6 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            초대 혜택
          </h3>
          <div className="space-y-4">
            {inviteBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {benefit.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 초대 현황 섹션 */}
        <section className="bg-white px-5 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              초대 현황
            </h3>
            <button 
              onClick={handleDetailClick}
              className="text-blue-600 text-sm font-medium flex items-center gap-1"
            >
              자세히 보기
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">0</div>
              <div className="text-sm text-gray-600">초대한 친구</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">0원</div>
              <div className="text-sm text-gray-600">받은 포인트</div>
            </div>
          </div>
        </section>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                초대 현황 상세
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">이번 달 초대</span>
                  <span className="text-sm font-medium text-gray-900">0명</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">이번 달 포인트</span>
                  <span className="text-sm font-medium text-gray-900">0원</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">총 초대</span>
                  <span className="text-sm font-medium text-gray-900">0명</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">총 포인트</span>
                  <span className="text-sm font-medium text-gray-900">0원</span>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-medium text-blue-900 mb-2">초대 보상 안내</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 친구 가입 시 5,000원 포인트 지급</li>
                  <li>• 포인트는 24시간 내 지급됩니다</li>
                  <li>• 중복 가입은 보상 대상이 아닙니다</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl mt-6 hover:bg-blue-700 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  )
} 