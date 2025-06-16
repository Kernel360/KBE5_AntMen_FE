'use client'

import {
  HomeIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface CategoryItemProps {
  icon: React.ReactNode
  label: string
  isNew?: boolean
  onClick: () => void
}

function CategoryItem({ icon, label, isNew, onClick }: CategoryItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 w-[70px] focus:outline-none"
      aria-label={label}
    >
      <div className="relative">
        <div className="w-14 h-14 bg-[#F5F5F5] rounded-full flex items-center justify-center">
          {icon}
        </div>
        {isNew && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">N</span>
          </div>
        )}
      </div>
      <span className="text-xs text-center text-[#333333]">{label}</span>
    </button>
  )
}

export function CategorySection() {
  const router = useRouter()

  return (
    <section className="bg-white rounded-t-3xl relative z-10 -mt-6 py-4">
      <div className="px-4 flex justify-between">
        <CategoryItem
          icon={<HomeIcon className="w-7 h-7 text-red-500" />}
          label="가사 청소"
          onClick={() => router.push('/reservation/select-address?categoryId=1')}
        />
        <CategoryItem
          icon={<CreditCardIcon className="w-7 h-7 text-blue-600" />}
          label="에어컨 청소"
          isNew
          onClick={() => router.push('/reservation/select-address?categoryId=3')}
        />
        <CategoryItem
          icon={<BuildingOfficeIcon className="w-7 h-7 text-cyan-500" />}
          label="사무실 청소"
          onClick={() => router.push('/reservation/select-address?categoryId=4')}
        />
        <CategoryItem
          icon={<TruckIcon className="w-7 h-7 text-cyan-500" />}
          label="입주 청소"
          onClick={() => router.push('/reservation/select-address?categoryId=5')}
        />
      </div>
    </section>
  )
}
