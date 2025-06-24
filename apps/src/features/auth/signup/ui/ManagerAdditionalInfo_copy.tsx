import React from 'react';

export interface ManagerAdditionalData {
  address: string;
  workArea: string;
  workHours: {
    start: string;
    end: string;
  };
}

interface ManagerAdditionalInfoProps {
  data: ManagerAdditionalData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onWorkHoursChange: (type: 'start' | 'end', value: string) => void;
  errors?: {
    [key: string]: string;
  };
}

export const ManagerAdditionalInfo: React.FC<ManagerAdditionalInfoProps> = ({
  data,
  onChange,
  onWorkHoursChange,
  errors = {},
}) => {
  return (
    <div className="space-y-6 pt-6 border-t border-gray-200">
      {/* Address */}
      <div className="space-y-2">
        <label className="block text-base font-medium">주소</label>
        <textarea
          name="address"
          value={data.address}
          onChange={onChange}
          className={`w-full h-24 p-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none resize-none ${
            errors.address ? 'border-2 border-red-500' : ''
          }`}
          placeholder="주소를 입력해주세요"
        />
        {errors.address && (
          <span className="text-red-500 text-sm">{errors.address}</span>
        )}
      </div>

      {/* Work Area */}
      <div className="space-y-2">
        <label className="block text-base font-medium">근무 가능 지역</label>
        <input
          type="text"
          name="workArea"
          value={data.workArea}
          onChange={onChange}
          className={`w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${
            errors.workArea ? 'border-2 border-red-500' : ''
          }`}
          placeholder="근무 가능한 지역을 입력해주세요"
        />
        {errors.workArea && (
          <span className="text-red-500 text-sm">{errors.workArea}</span>
        )}
      </div>

      {/* Work Hours */}
      <div className="space-y-2">
        <label className="block text-base font-medium">근무 가능 시간</label>
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={data.workHours.start}
            onChange={(e) => onWorkHoursChange('start', e.target.value)}
            className={`flex-1 h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${
              errors.workHours ? 'border-2 border-red-500' : ''
            }`}
          />
          <span className="text-gray-400">~</span>
          <input
            type="time"
            value={data.workHours.end}
            onChange={(e) => onWorkHoursChange('end', e.target.value)}
            className={`flex-1 h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${
              errors.workHours ? 'border-2 border-red-500' : ''
            }`}
          />
        </div>
        {errors.workHours && (
          <span className="text-red-500 text-sm">{errors.workHours}</span>
        )}
      </div>
    </div>
  );
}; 