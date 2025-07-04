'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { MANAGER_LIST, type Manager } from '@/widgets/manager/model/manager';

interface ManagerListProps {
  managers: Manager[];
  selectedManagers: string[];
  onManagerSelect: (managerId: string) => void;
}

export function ManagerList({ managers, selectedManagers, onManagerSelect }: ManagerListProps) {
  const [managersState, setManagersState] = useState<Manager[]>([]);

  useEffect(() => {
    // localStorage에서 매니저 리스트 가져오기
    const availableManagers = localStorage.getItem('availableManagers');
    if (availableManagers) {
      setManagersState(JSON.parse(availableManagers));
    } else {
      // localStorage에 데이터가 없으면 기본 리스트 사용
      setManagersState(MANAGER_LIST);
    }
  }, []);

  const getManagerPriority = (managerId: string) => {
    const index = selectedManagers.indexOf(managerId);
    if (index === -1) return null;
    return index + 1;
  };

  const getPriorityColor = (priority: number | null) => {
    if (!priority) return '';
    switch (priority) {
      case 1:
        return 'bg-primary';
      case 2:
        return 'bg-emerald-500';
      case 3:
        return 'bg-amber-500';
      default:
        return '';
    }
  };

  const getBorderColor = (priority: number | null) => {
    if (!priority) return 'border-slate-200';
    switch (priority) {
      case 1:
        return 'border-primary shadow-primary/10';
      case 2:
        return 'border-emerald-500 shadow-emerald-500/10';
      case 3:
        return 'border-amber-500 shadow-amber-500/10';
      default:
        return 'border-slate-200';
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 pt-20">
      <div className="max-w-[420px] mx-auto flex flex-col gap-4">
        {managers.map((manager) => {
          const priority = getManagerPriority(manager.id);
          const isSelected = priority !== null;

          return (
            <div
              key={manager.id}
              className={`relative bg-white rounded-2xl p-5 border-2 transition-all ${getBorderColor(priority)} shadow-lg`}
            >
              {isSelected && (
                <div className="absolute right-5 top-5">
                  <div className={`px-2.5 py-1 rounded-xl text-xs font-semibold text-white whitespace-nowrap ${getPriorityColor(priority)}`}>
                    {priority}순위
                  </div>
                </div>
              )}
              <div 
                className="flex gap-4 cursor-pointer" 
                onClick={() => onManagerSelect(manager.id)}
              >
                <div className="flex flex-col gap-2">
                  <div className="w-[72px] h-[72px] rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                    {manager.profileImage && manager.profileImage.includes('.') ? (
                      <img 
                        src={manager.profileImage} 
                        alt={`${manager.name} 프로필`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-2xl font-semibold text-slate-500">${manager.name[0]}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-2xl font-semibold text-slate-500">{manager.name[0]}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <StarIconOutline className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-slate-500">{manager.rating}</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2.5">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-slate-800">{manager.name} 매니저</h3>
                    <p className="text-sm text-slate-500">
                      {manager.gender} · {manager.age}세
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed break-keep">{manager.description}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link href={`/matching/manager/${manager.id}`}>
                  <button className="px-3 py-1.5 rounded-lg bg-slate-50 text-sm text-slate-600 hover:bg-slate-100">
                    상세보기
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 