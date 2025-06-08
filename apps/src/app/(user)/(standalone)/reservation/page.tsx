'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ServiceCardProps {
  title: string
  description: string[]
  isNew?: boolean
  className?: string
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  isNew,
  className,
}) => (
  <Link
    href="/reservation/form"
    className={`block bg-[#F8F8F8] rounded-xl p-4 ${className}`}
  >
    <div className="flex items-center gap-1">
      <h3 className="text-[18px] font-bold text-[#333333]">{title}</h3>
      {isNew && (
        <div className="flex justify-center items-center w-5 h-5 bg-[#FF5757] rounded-full">
          <span className="text-xs font-bold text-white">N</span>
        </div>
      )}
    </div>
    {description.map((text, index) => (
      <p key={index} className="text-sm text-[#666666] mt-2">
        {text}
      </p>
    ))}
  </Link>
)

interface ServiceIconProps {
  name: string
  icon: string
  isNew?: boolean
  discount?: string
}

const ServiceIcon: React.FC<ServiceIconProps> = ({
  name,
  icon,
  isNew,
  discount,
}) => (
  <Link
    href="/reservation/form"
    className="flex flex-col items-center gap-2 w-[89px] h-20"
  >
    <div className="relative">
      <div className="w-14 h-14 bg-[#F5F5F5] rounded-full flex items-center justify-center">
        <Image src={icon} alt={name} width={32} height={32} />
      </div>
      {isNew && (
        <div className="absolute -right-1 top-2 flex justify-center items-center w-4 h-4 bg-[#FF5757] rounded-full">
          <span className="text-[10px] font-bold text-white">N</span>
        </div>
      )}
      {discount && (
        <div className="absolute -right-2 top-2 flex justify-center items-center w-8 h-4 bg-[#4CAF50] rounded-lg">
          <span className="text-[10px] font-bold text-white">{discount}</span>
        </div>
      )}
    </div>
    <span className="text-xs font-medium text-[#333333] text-center w-full">
      {name}
    </span>
  </Link>
)

export default function ReservationPage() {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Navigation Header */}
      <div className="h-14 flex justify-between items-center px-4 border-b border-[#EEEEEE]">
        <Link href="/" className="w-6 h-6 flex items-center justify-center">
          <Image
            src="/icons/arrow-left.svg"
            alt="Back"
            width={24}
            height={24}
          />
        </Link>
        <div className="w-6" /> {/* Spacer for alignment */}
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-2.5">
        {/* 가사 청소 카드 */}
        <ServiceCard
          title="가사"
          description={['1회, 정기로 받는 가사 청소']}
          isNew
          className="h-[120px]"
        />

        {/* 사무실, 이사·입주 카드 그리드 */}
        <div className="grid grid-cols-2 gap-2.5">
          <ServiceCard
            title="사무실"
            description={['병원, 학원, 체육관', '청소도 가능']}
            className="h-[160px]"
          />
          <ServiceCard
            title="이사·입주"
            description={['전문 인력 청소']}
            className="h-[160px]"
          />
        </div>

        {/* 에어컨 청소 카드 */}
        <ServiceCard
          title="에어컨"
          description={['에어컨 전문 청소']}
          isNew
          className="h-[80px]"
        />

        {/* Promotion Banner */}
        <div className="bg-[#0A3A6D] rounded-xl h-20 flex justify-between overflow-hidden">
          <div className="p-4 space-y-1">
            <p className="text-base font-bold text-white">
              사무실 청소, 정기 100% 할인!
            </p>
            <p className="text-sm text-white opacity-90">
              정기 청소차 무료, 이후 10% 할인
            </p>
          </div>
          <div className="flex items-end p-4">
            <div className="bg-[#FF7A7A] bg-opacity-90 w-[60px] h-[30px] flex items-center justify-center rounded text-sm font-bold text-white">
              FREE
            </div>
          </div>
        </div>

        {/* Recommended Services */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#333333]">
            이런 서비스 어때요?
          </h2>
          <div className="grid grid-cols-4 gap-0">
            <ServiceIcon name="주방 청소" icon="/icons/kitchen.svg" isNew />
            <ServiceIcon name="화장실 청소" icon="/icons/bathroom.svg" />
            <ServiceIcon name="냉장실 청소" icon="/icons/fridge.svg" />
            <ServiceIcon name="입주 청소" icon="/icons/moving.svg" />
          </div>
          <div className="grid grid-cols-4 gap-0">
            <ServiceIcon
              name="병원 청소"
              icon="/icons/hospital.svg"
              discount="20%"
            />
            <ServiceIcon name="에어컨 청소" icon="/icons/aircon.svg" isNew />
          </div>
        </div>
      </div>
    </div>
  )
}
