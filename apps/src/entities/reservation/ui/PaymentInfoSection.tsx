import { ReservationDetail } from '../types'

const PaymentInfoSection = ({
  reservation,
}: {
  reservation: ReservationDetail
}) => {
  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString()}`
  }

  return (
    <div className="bg-white px-5 py-6">
      <h2 className="text-lg font-bold text-black mb-6">결제 정보</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            기본 요금 ({reservation.duration})
          </span>
          <span className="text-sm font-medium text-black">
            {formatCurrency(reservation.baseAmount)}
          </span>
        </div>
        {reservation.discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">정기 할인</span>
            <span className="text-sm font-medium text-orange-500">
              -{formatCurrency(reservation.discount)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <span className="text-base font-black text-black">총 결제 금액</span>
          <span className="text-base font-bold text-black">
            {formatCurrency(reservation.amount)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">결제 수단</span>
          <span className="text-sm font-medium text-black">
            {reservation.paymentMethod}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">결제 완료일</span>
          <span className="text-sm font-medium text-black">
            {new Date().toLocaleDateString('ko-KR')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PaymentInfoSection
