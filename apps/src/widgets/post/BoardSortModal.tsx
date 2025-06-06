import { Check } from 'lucide-react';
import { NoticeSortOption, InquirySortOption } from '@/shared/types/board';

// 공지사항 정렬 옵션
const NOTICE_SORT_OPTIONS = [
  { id: 'latest', label: '최신순' },
  { id: 'oldest', label: '오래된순' },
] as const;

// 문의게시판 정렬 옵션
const INQUIRY_SORT_OPTIONS = [
  { id: 'latest', label: '최신순' },
  { id: 'oldest', label: '오래된순' },
  { id: 'waiting', label: '미답변순' },
] as const;

interface BoardSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSort: NoticeSortOption | InquirySortOption;
  onSortChange: (sort: NoticeSortOption | InquirySortOption) => void;
  boardType: '공지사항' | '서비스 문의' | '업무 문의';
}

export const BoardSortModal = ({
  isOpen,
  onClose,
  selectedSort,
  onSortChange,
  boardType,
}: BoardSortModalProps) => {
  if (!isOpen) return null;

  const sortOptions = boardType === '공지사항' ? NOTICE_SORT_OPTIONS : INQUIRY_SORT_OPTIONS;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[370px] bg-white rounded-t-2xl z-50">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">정렬</h3>
        </div>

        {/* Options */}
        <div className="px-5 py-2">
          <div className="divide-y divide-gray-100">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                className="flex items-center justify-between w-full py-3.5"
                onClick={() => {
                  onSortChange(option.id);
                  onClose();
                }}
              >
                <span className={`text-base font-medium ${selectedSort === option.id ? 'text-gray-900' : 'text-gray-600/70'}`}>
                  {option.label}
                </span>
                {selectedSort === option.id && (
                  <Check className="h-5 w-5 text-primary" strokeWidth={2.5} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Padding */}
        <div className="h-6" />
      </div>
    </>
  );
}; 