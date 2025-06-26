'use client'

import Image from 'next/image'
import React from 'react'

interface AccountProfileProps {
  profileImage: File | null
  userProfileUrl: string
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const AccountProfile = ({ 
  profileImage, 
  userProfileUrl,
  onImageChange 
}: AccountProfileProps) => {
  // 로컬에서 선택한 이미지가 있으면 그것을 우선 표시, 없으면 서버의 이미지를 표시
  const imageUrl = profileImage 
    ? URL.createObjectURL(profileImage)
    : userProfileUrl;

  return (
    <div className="flex flex-col items-center">
      <label
        htmlFor="profileImage"
        className="cursor-pointer group relative"
      >
        <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
          {imageUrl ? (
            <Image
              width={112}
              height={112}
              src={imageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
            <div className="flex flex-col items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              <span className="text-sm mt-1">수정</span>
            </div>
          </div>
        </div>
        <input
          type="file"
          id="profileImage"
          name="profileImage"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
      </label>
    </div>
  )
} 