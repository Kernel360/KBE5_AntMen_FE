import { useRouter } from 'next/navigation'

const ReservationHeader = () => {
  const router = useRouter()

  return (
    <header className="bg-white px-5 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-6 h-6"
          aria-label="뒤로가기"
        >
          {/* 아이콘은 상위에서 import 하거나, 직접 import 하세요 */}
          {/* <ChevronLeft className="w-6 h-6 text-black" /> */}
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-black">예약 상세</h1>
      </div>
    </header>
  )
}

export default ReservationHeader
