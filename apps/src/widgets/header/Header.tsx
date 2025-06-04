import { Menu, Search, Plus } from 'lucide-react';

export const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-white">
      <div className="flex h-11 items-center justify-between px-4 pt-8">
        <span className="text-sm font-semibold">9:41</span>
        <div className="flex items-center space-x-1">
          <div className="h-4 w-4">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.33334 13.3333L1.33334 10.6667"
                stroke="black"
                strokeWidth="1.33333"
              />
              <path
                d="M4.66666 10.6667L4.66666 8"
                stroke="black"
                strokeWidth="1.33333"
              />
              <path d="M8 8L8 5.33333" stroke="black" strokeWidth="1.33333" />
              <path
                d="M11.3333 5.33333L11.3333 2.66667"
                stroke="black"
                strokeWidth="1.33333"
              />
              <path
                d="M14.6667 2.66667L14.6667 0"
                stroke="black"
                strokeWidth="1.33333"
              />
            </svg>
          </div>
          <div className="h-4 w-4">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 13.3333L8 13.3333"
                stroke="black"
                strokeWidth="1.33333"
              />
              <path
                d="M1.33334 3.33333L14.6667 5.87988"
                stroke="black"
                strokeWidth="1.33333"
              />
              <path
                d="M3.33334 6.66667L13.3333 8.57243"
                stroke="black"
                strokeWidth="1.33333"
              />
              <path
                d="M5.66666 10L10.3333 10.9529"
                stroke="black"
                strokeWidth="1.33333"
              />
            </svg>
          </div>
          <div className="h-4 w-4">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.33334 4.66667L12 4.66667"
                stroke="black"
                strokeWidth="1.33333"
              />
              <path
                d="M14.6667 7.33333L14.6667 8.66667"
                stroke="black"
                strokeWidth="1.33333"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex h-14 items-center justify-between border-b border-gray-200 px-5">
        <div className="flex items-center space-x-3">
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold">Notice Board</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <Search className="h-6 w-6 text-gray-500" />
          </button>
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <Plus className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
}; 