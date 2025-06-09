import { ReservationDetail } from '../types'

const ReservationStatusSection = ({
  reservation,
}: {
  reservation: ReservationDetail
}) => {
  const getStatusInfo = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'refunded') {
      return {
        text: '환불 완료',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-600',
      }
    }
    if (paymentStatus === 'pending') {
      return {
        text: '결제 대기',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600',
      }
    }
    switch (status) {
      case 'scheduled':
        return {
          text: '예정됨',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
        }
      case 'completed':
        return {
          text: '완료',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600',
        }
      case 'cancelled':
        return {
          text: '취소',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600',
        }
      default:
        return {
          text: '확인 중',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-600',
        }
    }
  }

  const statusInfo = getStatusInfo(
    reservation.status,
    reservation.paymentStatus,
  )

  return (
    <div className="bg-white px-5 py-6">
      {/* 상태 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-black">예약 상태</h2>
        <div
          className={`inline-flex items-center px-3 py-1.5 rounded-xl ${statusInfo.bgColor}`}
        >
          <span className={`text-xs font-medium ${statusInfo.textColor}`}>
            {statusInfo.text}
          </span>
        </div>
      </div>
      {/* 예약 정보 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">예약 번호</span>
          <span className="text-sm font-medium text-black">
            {reservation.reservationNumber}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">예약일</span>
          <span className="text-sm font-medium text-black">
            {new Date(reservation.createdAt).toLocaleDateString('ko-KR')}
          </span>
        </div>
        {/* 환불 완료 시 환불 정보 추가 표시 */}
        {reservation.paymentStatus === 'refunded' && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">취소일</span>
              <span className="text-sm font-medium text-black">
                {new Date().toLocaleDateString('ko-KR')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                환불 금액
              </span>
              <span className="text-sm font-medium text-red-600">
                ₩{reservation.amount.toLocaleString()}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ReservationStatusSection
