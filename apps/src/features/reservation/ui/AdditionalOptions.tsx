'use client'

import type { CategoryOption } from '@/shared/api/category'

interface AdditionalOptionsProps {
  selectedCategory: number | null
  selectedCategoryOptions: number[]
  onCategoryOptionsChange: (options: number[]) => void
  categoryOptions: CategoryOption[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

export const AdditionalOptions = ({
  selectedCategory,
  selectedCategoryOptions,
  onCategoryOptionsChange,
  categoryOptions,
  isLoading,
  error,
  onRetry,
}: AdditionalOptionsProps) => {
  const handleOptionClick = (optionId: number) => {
    onCategoryOptionsChange(
      selectedCategoryOptions.includes(optionId)
        ? selectedCategoryOptions.filter((id) => id !== optionId)
        : [...selectedCategoryOptions, optionId],
    )
  }

  const selectedOptionsDetails = categoryOptions.filter((option) =>
    selectedCategoryOptions.includes(option.coId),
  )
  const totalOptionsTime = selectedOptionsDetails.reduce(
    (total, option) => total + option.coTime,
    0,
  )
  const totalOptionsPrice = selectedOptionsDetails.reduce(
    (total, option) => total + option.coPrice,
    0,
  )

  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">추가 서비스 옵션</h2>
        {isLoading ? (
          <div className="p-4 bg-gray-100 rounded-xl text-center">
            <p className="text-gray-500 animate-pulse">옵션을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 rounded-xl text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={onRetry}
              className="mt-3 text-sm text-black font-bold"
            >
              다시 시도
            </button>
          </div>
        ) : categoryOptions.length > 0 ? (
          <div className="space-y-3">
            {categoryOptions.map((option) => (
              <button
                key={option.coId}
                onClick={() => handleOptionClick(option.coId)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200
                  ${
                    selectedCategoryOptions.includes(option.coId)
                      ? 'bg-primary text-black shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-bold">{option.coName}</span>
                  <span className="text-base font-bold">
                    {option.coPrice > 0
                      ? `+${option.coPrice.toLocaleString()}원`
                      : '추가비용 없음'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90"></span>
                  <span className="text-sm opacity-90">+{option.coTime}분</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-gray-100 rounded-xl text-center">
            <p className="text-gray-500">
              이 서비스에 대한 추가 서비스 옵션이 없습니다.
            </p>
          </div>
        )}
      </div>

      {selectedCategoryOptions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">선택된 추가 서비스</h2>
          <div className="bg-gray-100 rounded-xl p-4 space-y-2">
            {selectedOptionsDetails.map((option) => (
              <div
                key={option.coId}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-800">{option.coName}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">+{option.coTime}분</span>
                  <span className="font-semibold text-black w-20 text-right">
                    +{option.coPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            ))}
            <div className="!mt-4 pt-3 border-t flex justify-between items-center">
              <span className="text-base font-bold text-gray-800">
                총 추가금액
              </span>
              <span className="font-bold text-lg text-black">
                +{totalOptionsPrice.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
