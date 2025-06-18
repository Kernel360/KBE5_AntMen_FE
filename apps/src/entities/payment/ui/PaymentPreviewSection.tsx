import { PaymentRequestDto } from '../model/types'

const PaymentPreviewSection = ({
  paymentRequest,
}: {
  paymentRequest: PaymentRequestDto
}) => {
  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString()}`
  }

  return (
    <div className="bg-white px-5 py-6">
      <h2 className="text-lg font-bold text-black mb-6">결제 예정 금액</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">결제 금액</span>
          <span className="text-sm font-medium text-black">
            {formatCurrency(paymentRequest.payAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <span className="text-base font-black text-black">총 결제 금액</span>
          <span className="text-base font-bold text-[#4abed9]">
            {formatCurrency(paymentRequest.payAmount)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PaymentPreviewSection
