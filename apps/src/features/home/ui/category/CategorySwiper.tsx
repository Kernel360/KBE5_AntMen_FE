'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'

export function CategorySwiper() {
  const categories = [
    {
      img: '/',
      alt: '수의사상담',
      label: '가사 청소',
      desc: '대청소, 부분 청소',
      href: '/reservation/select-address?categoryId=1',
    },
    {
      img: 'https://images.pet-friends.co.kr/resource/bff/home/category/button/petterior_button.png',
      alt: '펫테리어',
      label: '에어컨 청소',
      desc: '미리 준비하세요',
      href: '/reservation/select-address?categoryId=3',
    },
    {
      img: 'https://images.pet-friends.co.kr/resource/bff/home/category/button/pet_travel_button.png',
      alt: '펫여행',
      label: '사무실 청소',
      desc: '사무실, 상가 등',
      href: '/reservation/select-address?categoryId=4',
    },
    {
      img: 'https://images.pet-friends.co.kr/resource/bff/home/category/button/pet_travel_button.png',
      alt: '펫여행',
      label: '입주 청소',
      desc: '이사 전/후',
      href: '/reservation/select-address?categoryId=5',
    },
  ]

  return (
    <section className="bg-white rounded-t-3xl relative z-10 -mt-6 py-4">
      {/* @ts-ignore - Swiper 타입 호환성 문제 임시 해결 */}
      <Swiper
        spaceBetween={8}
        slidesPerView="auto"
        freeMode={true}
        grabCursor={true}
        className="overflow-x-auto scrollbar-hide"
        modules={[FreeMode]}
      >
        {categories.map((cat, idx) => (
          // @ts-ignore - SwiperSlide 타입 호환성 문제 임시 해결
          <SwiperSlide
            key={cat.label + idx}
            className={[
              'flex-shrink-0 !w-auto',
              idx === 0 ? 'pl-5' : '',
              idx === categories.length - 1 ? 'pr-5' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <button
              type="button"
              className="size-1/3 rounded-md px-2 py-1 shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors bg-[#f5f5f5] text-black"
              aria-label={cat.label}
              onClick={() => (window.location.href = cat.href)}
            >
              <span className="relative flex items-center justify-center size-1/3">
                <img
                  src={cat.img}
                  alt={cat.alt}
                  width={120}
                  height={120}
                  className="object-contain"
                  style={{ color: 'transparent' }}
                />
              </span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
