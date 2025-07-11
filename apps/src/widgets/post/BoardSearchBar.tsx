import { Search, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BoardSearchBarProps {
  onSearch: (value: string) => void;
  onFilterClick: () => void;
  searchTerm?: string;
}

export const BoardSearchBar = ({ onSearch, onFilterClick, searchTerm = '' }: BoardSearchBarProps) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(inputValue);
    }
  };

  return (
    <div className="sticky top-14 z-10 bg-white px-4 py-3 border-b">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="게시글 검색"
            className="h-11 w-full rounded-xl bg-gray-50 pl-10 pr-4 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/10"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          onClick={onFilterClick}
          className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-gray-50"
        >
          <SlidersHorizontal className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}; 