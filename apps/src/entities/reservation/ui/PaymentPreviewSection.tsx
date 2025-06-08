import { ReservationDetail } from '../types'

const PaymentPreviewSection = ({
  reservation,
}: {
  reservation: ReservationDetail
}) => {
  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString()}`
  }

  return (
    <div className="bg-white px-5 py-6">
      <h2 className="text-lg font-bold text-black mb-6">결제 예정 금액</h2>
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
          <span className="text-base font-bold text-[#4abed9]">
            {formatCurrency(reservation.amount)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PaymentPreviewSection
