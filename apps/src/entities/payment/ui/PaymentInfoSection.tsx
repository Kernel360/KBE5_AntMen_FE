import { Payment } from '../model/types'

const PaymentInfoSection = ({
  payment,
}: {
  payment: Payment
}) => {
  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString()}`
  }

  return (
    <div className="bg-white px-5 py-6">
      <h2 className="text-lg font-bold text-black mb-6">결제 정보</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">결제 금액</span>
          <span className="text-sm font-medium text-black">
            {formatCurrency(payment.payAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <span className="text-base font-black text-black">총 결제 금액</span>
          <span className="text-base font-bold text-black">
            {formatCurrency(payment.payAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">결제 수단</span>
          <span className="text-sm font-medium text-black">
            {payment.payMethod}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">결제 상태</span>
          <span className="text-sm font-medium text-black">
            {payment.payStatus}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">결제 완료일</span>
          <span className="text-sm font-medium text-black">
            {new Date(payment.payCreatedTime).toLocaleDateString('ko-KR')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PaymentInfoSection
