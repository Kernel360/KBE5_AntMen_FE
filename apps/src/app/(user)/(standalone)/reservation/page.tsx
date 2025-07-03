'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllCategories, Category } from '@/shared/api/category';
import { CustomerAuthGuard } from '@/components/auth/CustomerAuthGuard';
import { CommonHeader } from '@/shared/ui/Header/CommonHeader';

interface ServiceCardProps {
  title: string;
  description: string[];
  isNew?: boolean;
  className?: string;
  categoryId: number;
}

const ServiceCard = ({ title, description, isNew, className, categoryId }: ServiceCardProps) => (
  <Link href={`/reservation/select-address?categoryId=${categoryId}`} className={`block bg-gray-50 rounded-xl p-4 hover:bg-primary-200 transition-colors border-1  ${className}`}>
    <div className="flex items-center gap-1">
      <h3 className="text-[18px] font-bold text-[#333333]">{title}</h3>
      {isNew && (
        <div className="flex justify-center items-center w-5 h-5 bg-[#FF5757] rounded-full">
          <span className="text-xs font-bold text-white">N</span>
        </div>
      )}
    </div>
    {description.map((text, index) => (
      <p key={index} className="text-sm text-[#666666] mt-3 whitespace-pre-line">
        {text}
      </p>
    ))}
  </Link>
)

interface ServiceIconProps {
  name: string
  icon: string
  href: string
  isNew?: boolean
  discount?: string
}

const ServiceIcon = ({ name, icon, href, isNew, discount }: ServiceIconProps) => (
  <Link
    href={href}
    className="flex flex-col items-center gap-1 w-[89px] h-20 rounded-xl group">
    <div className="relative">
      <div className="w-14 h-14 bg-[#F5F5F5] rounded-full flex items-center justify-center transition-colors group-hover:bg-primary-200">
        <Image src={icon} alt={name} width={32} height={32} />
      </div>
      {isNew && (
        <div className="absolute -right-1 top-2 flex justify-center items-center w-4 h-4 bg-[#FF5757] rounded-full">
          <span className="text-[10px] font-bold text-white">N</span>
        </div>
      )}
      {discount && (
        <div className="absolute -right-2 top-2 flex justify-center items-center w-7 h-4 bg-[#4CAF50] rounded-lg">
          <span className="text-[9px] font-bold text-white">{discount}</span>
        </div>
      )}
    </div>
    <span className="text-xs font-medium text-[#333333] text-center w-full">
      {name}
    </span>
  </Link>
)

// 카테고리별 description 매핑 객체
const categoryDescriptions: Record<number, string[]> = {
  1: ['세탁, 창틀 청소 등 가사 청소 서비스'],
  3: ['번거로운 주방 청소 \n간편하게 청소'],
  4: ['병원, 학원, 사무실 청소'],
  5: ['어려운 입주 청소를 \n간편하게 해결'],
  6: ['새로운 육아 서비스']
}

export default function ReservationPageWrapper() {
  return (
    <CustomerAuthGuard>
      <ReservationPage />
    </CustomerAuthGuard>
  );
}

function ReservationPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const data = await getAllCategories()
        setCategories(data)
      } catch (err) {
        setError('카테고리 목록을 불러오는 데 실패했습니다.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])
  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div>로딩 중...</div>
        </div>)}

  if (error) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div>{error}</div>
        </div>)}

  return (
    <div className="min-h-screen bg-white">
      <CommonHeader 
        title="예약하기"
        showBackButton
      />

    {/* Content */}
    <div className="pt-20 px-4 py-4 pb-20 min-h-[calc(100vh-64px)] space-y-4">
      <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#333333]">서비스를 선택하세요</h2>
        {/* 상단 1개 */}
        {categories.length > 0 && (
          <ServiceCard
            key={categories[0].categoryId}
            categoryId={categories[0].categoryId}
            title={categories[0].categoryName}
            description={categoryDescriptions[categories[0].categoryId]}
            className="h-auto"
          />
        )}
        {/* 하단 2열 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          {categories.slice(1).map((category) => (
            <ServiceCard
              key={category.categoryId}
              categoryId={category.categoryId}
              title={category.categoryName}
              description={categoryDescriptions[category.categoryId] || ['청소 서비스']}
              className="h-auto"
            />
          ))}
        </div>
      </div>

        

        {/* Recommended Services */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-[#333333]">이런 서비스 어때요?</h2>
          <div className="grid grid-cols-4 gap-2">
            <ServiceIcon name="베란다 청소" icon="/icons/window.svg" href="/reservation/select-address?categoryId=1" />
            <ServiceIcon name="화장실 청소" icon="/icons/bath.svg" href="/reservation/select-address?categoryId=1" />
            <ServiceIcon name="냉장고 청소" icon="/icons/refrigerator.svg" href="/reservation/select-address?categoryId=3" />
            <ServiceIcon name="간단 요리" icon="/icons/cook.svg" href="/reservation/select-address?categoryId=3" />
            <ServiceIcon name="서류 정리" icon="/icons/budget.svg" href="/reservation/select-address?categoryId=4" isNew />
            <ServiceIcon name="물품 포장" icon="/icons/bear.svg" href="/reservation/select-address?categoryId=5" isNew />
            <ServiceIcon name="의류 포장" icon="/icons/tshirt.svg" href="/reservation/select-address?categoryId=5" isNew />
            <ServiceIcon name="아이 등하교" icon="/icons/baby2.svg" href="/reservation/select-address?categoryId=6" discount="20%" />
          </div>
        </div>
        
        {/* Promotion Banner */}
        <div className="bg-[#0A3A6D] rounded-xl h-20 flex justify-between overflow-hidden">
          <div className="p-4 space-y-1">
            <p className="text-base font-bold text-white">
              새로운 서비스가 곧 찾아옵니다
            </p>
            <p className="text-sm text-white opacity-90">
              청소 용품 구매 20% 할인!
            </p>
          </div>
          <div className="flex items-end p-4">
            <div className="bg-[#FF7A7A] bg-opacity-90 w-[60px] h-[30px] flex items-center justify-center rounded text-sm font-bold text-white">
              NEW
            </div>
          </div>
        </div>
        <div className="bg-[#0A3A6D] rounded-xl h-20 flex justify-between overflow-hidden">
          <div className="p-4 space-y-1">
            <p className="text-base font-bold text-white">
              새로운 서비스 출시
            </p>
            <p className="text-sm text-white opacity-90">
              육아 서비스 20% 할인 중!
            </p>
          </div>
          <div className="flex items-end p-4">
            <div className="bg-[#FF7A7A] bg-opacity-90 w-[60px] h-[30px] flex items-center justify-center rounded text-sm font-bold text-white">
              NEW
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}