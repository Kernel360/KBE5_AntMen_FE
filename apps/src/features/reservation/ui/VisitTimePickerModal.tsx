'use client';

import { Transition } from '@headlessui/react';
import React from 'react';

interface VisitTimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitTimeSlots: string[];
  selectedVisitTime: string | null;
  onSelectVisitTime: (time: string) => void;
}

export const VisitTimePickerModal = ({
  isOpen,
  onClose,
  visitTimeSlots,
  selectedVisitTime,
  onSelectVisitTime,
}: VisitTimePickerModalProps) => {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <div className="fixed inset-0 z-40">
        {/* Backdrop */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
        </Transition.Child>
        
        {/* Modal */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
        >
          <div className="fixed bottom-0 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 w-full sm:max-w-md bg-white rounded-t-2xl z-50 shadow-2xl max-h-[80vh]">
            <div className="py-3 flex justify-center cursor-pointer" onClick={onClose}>
              <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <button className="text-gray-500" onClick={onClose}>취소</button>
              <h3 className="text-lg font-bold">방문 시간 선택</h3>
              <button className="text-cyan-500 font-medium" onClick={onClose}>확인</button>
            </div>
            
            <div className="overflow-y-auto pb-safe-bottom">
              {/* Time Slots */}
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {visitTimeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        onSelectVisitTime(time);
                        onClose();
                      }}
                      className={`py-3 rounded-lg text-center text-sm font-medium transition-colors
                        ${selectedVisitTime === time 
                          ? 'bg-cyan-500 text-white shadow' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notice */}
              <div className="p-4 bg-gray-50 mt-2">
                <p className="text-sm text-gray-500 text-center">
                  방문 시간은 30분 단위로 선택 가능합니다.
                </p>
              </div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
}; 