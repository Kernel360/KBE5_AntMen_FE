// 매칭 거절 시 표시되는 모달 컴포넌트: 예약 취소 또는 다시 매칭 선택 가능
// TODO : 선영 거절 모달 컴포넌트니까 나중에 매칭 로직 붙으면 사용할지말지 결정
'use client';

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (option: 'cancel' | 'rematch') => void;
}

export default function RejectionModal({ isOpen, onClose, onConfirm }: RejectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[335px]">
        <div className="bg-white rounded-xl">
          {/* Modal Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">매칭을 거절하시겠습니까?</h2>
              <button onClick={onClose} className="text-slate-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <p className="text-sm text-slate-500">거절 후 진행 방법을 선택해주세요</p>
          </div>

          {/* Options List */}
          <div className="p-6 space-y-4">
            {/* Option 1: 예약 취소 */}
            <button
              onClick={() => onConfirm('cancel')}
              className="w-full flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:border-red-500 transition-colors"
            >
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path d="M15 5L5 15M5 5l10 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-slate-900">예약 취소하기</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  전체 예약을 취소하고 처음부터 다시 시작합니다
                </p>
              </div>
            </button>

            {/* Option 2: 다시 매칭 */}
            <button
              onClick={() => onConfirm('rematch')}
              className="w-full flex items-start gap-4 p-4 border border-[#4ABED9] rounded-xl relative"
            >
              <div className="w-10 h-10 bg-[#E0F7FA] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#4ABED9]" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-left pr-8">
                <h3 className="text-sm font-semibold text-slate-900">다른 매니저 다시 매칭받기</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  현재 예약 조건으로 다른 매니저를 찾아드립니다
                </p>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-[#4ABED9] rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none" stroke="currentColor">
                    <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Modal Actions */}
          <div className="p-6 pt-0">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-lg bg-slate-50 text-slate-600 font-semibold text-base border border-slate-200"
              >
                취소
              </button>
              <button
                onClick={() => onConfirm('rematch')}
                className="flex-1 py-3.5 rounded-lg bg-[#4ABED9] text-white font-semibold text-base"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 