'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IoChevronBack, IoEllipsisHorizontal } from 'react-icons/io5';
import { AiFillStar } from 'react-icons/ai';
import { IoMdHeart } from 'react-icons/io';
import { BiTimeFive } from 'react-icons/bi';
import { MdThumbUp } from 'react-icons/md';
import { MANAGER_LIST } from '@/constants/manager';
import type { IconType } from 'react-icons';
import { IconContext, IconBaseProps } from 'react-icons';
import { createElement, FC } from 'react';

const DynamicIcon = ({ icon, ...props }: { icon: IconType } & { className?: string; size?: number }) => {
  const Component = icon as React.ComponentType<any>;
  return <Component {...props} />;
};

export default function ManagerDetailPage() {
  const params = useParams();
  const managerId = typeof params?.managerId === 'string' ? params.managerId : '';
  const manager = MANAGER_LIST.find(m => m.id === managerId);

  if (!manager) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">매니저를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const getCharacteristicContent = (type: 'kind' | 'punctual' | 'thorough') => {
    switch (type) {
      case 'kind':
        return {
          icon: IoMdHeart,
          style: 'bg-blue-50 text-blue-700',
          color: 'text-blue-500'
        };
      case 'punctual':
        return {
          icon: BiTimeFive,
          style: 'bg-green-50 text-green-700',
          color: 'text-green-500'
        };
      case 'thorough':
        return {
          icon: MdThumbUp,
          style: 'bg-red-50 text-red-700',
          color: 'text-red-500'
        };
      default:
        return {
          icon: IoMdHeart,
          style: 'bg-blue-50 text-blue-700',
          color: 'text-blue-500'
        };
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[370px] min-h-screen flex flex-col relative">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b">
          <Link href="/matching" className="text-gray-800">
            <DynamicIcon icon={IoChevronBack} size={24} />
          </Link>
          <h1 className="text-lg font-medium">목록으로 돌아가기</h1>
          <button className="text-gray-800">
            <DynamicIcon icon={IoEllipsisHorizontal} size={24} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-[140px]">
          {/* Profile Section */}
          <div className="px-4 py-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-4xl mb-4">
                {manager.profileImage}
              </div>
              <h2 className="text-2xl font-bold mb-2">{manager.name} 매니저</h2>
              <p className="text-gray-600 mb-2">{manager.gender} · {manager.age}세 · {manager.experience}년 경력</p>
              <div className="flex items-center gap-1 mb-4">
                {Array(Math.floor(manager.rating)).fill(null).map((_, index) => (
                  <DynamicIcon key={index} icon={AiFillStar} className="text-yellow-400" size={20} />
                ))}
                {manager.rating % 1 > 0 && (
                  <DynamicIcon icon={AiFillStar} className="text-gray-300" size={20} />
                )}
                <span className="text-gray-600 ml-2">{manager.rating}점 (리뷰 {manager.reviewCount}개)</span>
              </div>
            </div>
          </div>

          {/* Introduction Section */}
          <section className="px-4 py-6 border-t">
            <h3 className="text-xl font-bold mb-4">자기소개</h3>
            <p className="text-gray-700 leading-relaxed">
              {manager.introduction}
            </p>
          </section>

          {/* Characteristics Section */}
          <section className="px-4 py-6 border-t">
            <h3 className="text-xl font-bold mb-4">성격 특징</h3>
            <div className="flex gap-3">
              {manager.characteristics.map(characteristic => {
                const { icon, style, color } = getCharacteristicContent(characteristic.type as 'kind' | 'punctual' | 'thorough');
                return (
                  <div 
                    key={characteristic.id} 
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${style}`}
                  >
                    <DynamicIcon icon={icon} className={color} size={14} />
                    <span className="text-xs">{characteristic.label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Reviews Section */}
          <section className="px-4 py-6 border-t">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">고객 리뷰</h3>
              <Link href="#" className="text-blue-500">
                전체보기 &gt;
              </Link>
            </div>
            {manager.reviews.map(review => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{review.userName}</span>
                  <div className="flex">
                    {Array(review.rating).fill(null).map((_, index) => (
                      <DynamicIcon key={index} icon={AiFillStar} className="text-yellow-400" size={16} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{review.content}</p>
                <p className="text-gray-500 text-sm">{review.date}</p>
              </div>
            ))}
          </section>
        </div>

        {/* Bottom Button */}
        <div className="fixed bottom-0 w-full max-w-[370px] bg-white">
          <div className="px-4">
            <div className="border-t border-slate-200">
              <div className="py-4">
                <Link href="/matching" className="block">
                  <button className="w-full h-14 rounded-2xl font-semibold text-white text-lg bg-primary">
                    목록으로 돌아가기
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 