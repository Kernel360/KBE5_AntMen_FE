import { Worker } from '../types'

const CleanerInfoSection = ({ worker }: { worker: Worker }) => {
  return (
    <div className="bg-white px-5 py-6">
      <h2 className="text-lg font-bold text-black mb-6">매칭 매니저</h2>
      <div className="flex items-start gap-4">
        {/* 프로필 이미지 */}
        <div className="w-15 h-15 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-base font-black text-white">
            {worker.avatar}
          </span>
        </div>
        {/* 매니저 정보 */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-black text-black">{worker.name}</h3>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-black">
                {worker.rating}
              </span>
              <svg
                className="w-4 h-4 text-orange-500 fill-orange-500"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600">{worker.experience}</p>
        </div>
      </div>
    </div>
  )
}

export default CleanerInfoSection
