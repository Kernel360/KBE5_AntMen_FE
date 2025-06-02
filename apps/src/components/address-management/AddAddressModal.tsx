"use client";

import React, { useEffect, useState } from "react";

interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddressSearchModal: React.FC<AddressSearchModalProps> = ({ isOpen, onClose }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      const timer = setTimeout(() => setShowModal(false), 300); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!showModal) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}>
      <div 
        className={`bg-white rounded-lg p-6 shadow-xl flex flex-col gap-6 max-w-[400px] w-[90%] transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold text-gray-800">주소 검색</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-light focus:outline-none">
            &times;
          </button>
        </div>

        {/* Modal Content (Placeholder) */}
        <div className="flex-grow flex items-center justify-center text-gray-500">
          주소 검색 입력 필드와 결과가 여기에 표시됩니다.
        </div>

        {/* Modal Footer (Optional, add buttons here if needed) */}
        {/* <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">닫기</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">확인</button>
        </div> */}
      </div>
    </div>
  );
};

export default AddressSearchModal;