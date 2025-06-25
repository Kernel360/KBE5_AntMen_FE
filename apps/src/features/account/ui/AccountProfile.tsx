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
    <div className="flex flex-col items-center mb-6">
      <label
        htmlFor="profileImage"
        className="cursor-pointer group relative"
      >
        <div className="w-24 h-24 bg-[#F9F9F9] rounded-full flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <Image
              width={96}
              height={96}
              src={imageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">수정하기</span>
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