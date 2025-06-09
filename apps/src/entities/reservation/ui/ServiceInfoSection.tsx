import { ReservationDetail } from '../types'

const ServiceInfoSection = ({
  reservation,
}: {
  reservation: ReservationDetail
}) => {
  return (
    <div className="bg-white px-5 py-6">
      <h2 className="text-lg font-bold text-black mb-6">서비스 정보</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">서비스 유형</span>
          <span className="text-sm font-medium text-black">
            {reservation.serviceType}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            날짜 및 시간
          </span>
          <span className="text-sm font-medium text-black">
            {reservation.dateTime}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">소요 시간</span>
          <span className="text-sm font-medium text-black">
            {reservation.duration}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">주소</span>
          <span className="text-sm font-medium text-black text-right max-w-[200px]">
            {reservation.detailedAddress}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ServiceInfoSection
