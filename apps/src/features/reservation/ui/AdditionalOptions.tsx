'use client';

import { CategoryOption } from '@/shared/api/category';
import { useState } from 'react';

interface AdditionalOptionsProps {
  categoryOptions: CategoryOption[];
  selectedCategoryOptions: number[];
  onOptionChange: (optionIds: number[]) => void;
  onDurationChange: (duration: number) => void;
}

export const AdditionalOptions = ({
  categoryOptions,
  selectedCategoryOptions,
  onOptionChange,
  onDurationChange,
}: AdditionalOptionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOptionToggle = (optionId: number) => {
    const newSelectedOptions = selectedCategoryOptions.includes(optionId)
      ? selectedCategoryOptions.filter(id => id !== optionId)
      : [...selectedCategoryOptions, optionId];
    
    onOptionChange(newSelectedOptions);
  };

  const selectedOptionsDetails = categoryOptions.filter(option => selectedCategoryOptions.includes(option.optionId));
  const totalOptionsTime = selectedOptionsDetails.reduce((total, option) => total + option.optionTime, 0);
  const totalOptionsPrice = selectedOptionsDetails.reduce((total, option) => total + option.optionPrice, 0);

  return (
    <div className="bg-white rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">추가 옵션</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-cyan-500 font-medium"
        >
          {isExpanded ? '접기' : '펼치기'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {categoryOptions.map((option) => (
            <div
              key={option.optionId}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`option-${option.optionId}`}
                  checked={selectedCategoryOptions.includes(option.optionId)}
                  onChange={() => handleOptionToggle(option.optionId)}
                  className="w-5 h-5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
                />
                <label
                  htmlFor={`option-${option.optionId}`}
                  className="text-sm font-medium text-gray-700"
                >
                  {option.optionName}
                </label>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {option.optionPrice.toLocaleString()}원
                </p>
                <p className="text-xs text-gray-500">
                  +{option.optionTime}분
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCategoryOptions.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">추가 시간</p>
            <p className="text-sm font-medium text-gray-900">
              +{totalOptionsTime}분
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-600">추가 금액</p>
            <p className="text-sm font-medium text-gray-900">
              +{totalOptionsPrice.toLocaleString()}원
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 