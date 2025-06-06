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
  { id: 'mostComments', label: '댓글 많은 순' },
  { id: 'waiting', label: '답변 대기 순' },
  { id: 'completed', label: '답변 완료 순' },
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
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[370px] bg-white rounded-t-2xl z-50 overflow-hidden">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">정렬</h3>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => {
                  onSortChange(option.id);
                  onClose();
                }}
              >
                <span className="text-base text-gray-900">{option.label}</span>
                {selectedSort === option.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}; 