'use client';

import React from 'react';

const UserPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">사용자 관리</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 사용자 카드 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JD</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">John Doe</h3>
                  <p className="text-sm text-gray-600">john@example.com</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                  수정
                </button>
                <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                  삭제
                </button>
              </div>
            </div>

            {/* 추가 사용자 카드 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JS</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Jane Smith</h3>
                  <p className="text-sm text-gray-600">jane@example.com</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                  수정
                </button>
                <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                  삭제
                </button>
              </div>
            </div>

            {/* 새 사용자 추가 카드 */}
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>새 사용자 추가</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;