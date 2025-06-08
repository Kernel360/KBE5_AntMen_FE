import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard } from 'lucide-react'
import { CancellationModal, RefundModal } from '@/shared/ui/modal'
import dynamic from 'next/dynamic'
import { ReservationDetail } from '@/entities/reservation/types'

interface ReservationActionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (option: 'cancel' | 'reschedule') => void
  isPaid?: boolean
  title?: string
  description?: string
}

const ReservationActionModal = dynamic<ReservationActionModalProps>(
  () =>
    import('@/shared/ui/modal/ReservationActionModal').then(
      (mod) => mod.default,
    ),
  { ssr: false },
)

const ActionButtonsSection = ({
  reservation,
  onCancel,
  onPayment,
  onRefund,
  reservationId,
}: {
  reservation: ReservationDetail
  onCancel: (reason: string) => void
  onPayment: () => void
  onRefund: (reason: string) => void
  reservationId: string
}) => {
  const router = useRouter()
  const [showActionModal, setShowActionModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)

  const handleActionConfirm = (option: 'cancel' | 'reschedule') => {
    if (option === 'cancel') {
      setShowActionModal(false)
      if (reservation.paymentStatus === 'paid') {
        setShowRefundModal(true)
      } else {
        setShowCancelModal(true)
      }
    } else if (option === 'reschedule') {
      setShowActionModal(false)
      router.push(`/reservation/${reservationId}/matching/managers`)
    }
  }

  const handleCancelConfirm = (reason: string) => {
    onCancel(reason)
    setShowCancelModal(false)
  }

  const handleRefundConfirm = (reason: string) => {
    onRefund(reason)
    setShowRefundModal(false)
  }

  if (reservation.status === 'cancelled') {
    return null
  }

  if (reservation.paymentStatus === 'pending') {
    return (
      <>
        <div className="bg-white px-5 py-6 space-y-3">
          <button
            onClick={() => setShowActionModal(true)}
            className="w-full h-14 bg-white border border-gray-300 rounded-xl flex items-center justify-center"
          >
            <span className="text-base font-black text-gray-600">
              예약 취소
            </span>
          </button>
          <button
            onClick={onPayment}
            className="w-full h-14 bg-[#4abed9] rounded-xl flex items-center justify-center"
          >
            <CreditCard className="w-5 h-5 text-white mr-2" />
            <span className="text-base font-black text-white">결제하기</span>
          </button>
        </div>
        <ReservationActionModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          onConfirm={handleActionConfirm}
          isPaid={false}
        />
        <CancellationModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelConfirm}
        />
      </>
    )
  }

  if (reservation.paymentStatus === 'refunded') {
    return (
      <div className="bg-white px-5 py-6">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            환불 완료
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            예약이 취소되고 환불이 완료되었습니다.
            <br />
            환불 금액은 영업일 기준 3-5일 내에 입금됩니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white px-5 py-6 space-y-3">
        <button
          onClick={() => setShowActionModal(true)}
          className="w-full h-14 bg-white border border-gray-300 rounded-xl flex items-center justify-center"
        >
          <span className="text-base font-black text-gray-600">예약 취소</span>
        </button>
      </div>
      <ReservationActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onConfirm={handleActionConfirm}
        isPaid={true}
      />
      <RefundModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        onConfirm={handleRefundConfirm}
      />
    </>
  )
}

export default ActionButtonsSection
