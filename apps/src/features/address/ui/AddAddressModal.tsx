"use client";

import React, { useEffect, useState } from "react";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({ isOpen, onClose }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      const timer = setTimeout(() => setShowModal(false), 300);
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
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold text-gray-800">주소 검색</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-light focus:outline-none">
            &times;
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center text-gray-500">
          주소 검색 입력 필드와 결과가 여기에 표시됩니다.
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal; 