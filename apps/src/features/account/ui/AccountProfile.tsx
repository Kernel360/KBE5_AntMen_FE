'use client'

import Image from 'next/image'
import React from 'react'

interface AccountProfileProps {
  profileImage: File | null
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const AccountProfile = ({ profileImage, onImageChange }: AccountProfileProps) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <label
        htmlFor="profileImage"
        className="cursor-pointer group relative"
      >
        <div className="w-24 h-24 bg-[#F9F9F9] rounded-full flex items-center justify-center overflow-hidden">
          {profileImage ? (
            <>
              <Image
                width={96}
                height={96}
                src={URL.createObjectURL(profileImage)}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">수정하기</span>
              </div>
            </>
          ) : (
            <>
              <span className="text-gray-400 text-4xl">+</span>
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">추가하기</span>
              </div>
            </>
          )}
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