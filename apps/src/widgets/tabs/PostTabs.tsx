interface PostTabsProps {
  activeTab: 'notice' | 'work';
  onTabChange: (tab: 'notice' | 'work') => void;
}

export const PostTabs = ({ activeTab, onTabChange }: PostTabsProps) => {
  return (
    <div className="w-full bg-white">
      <div className="border-b border-gray-200 px-4">
        <div className="flex h-14">
          <button
            className={`relative flex h-full items-center justify-center px-5 ${
              activeTab === 'notice'
                ? 'text-gray-900 font-semibold'
                : 'text-gray-500'
            }`}
            onClick={() => onTabChange('notice')}
          >
            Notice
            {activeTab === 'notice' && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#4ABED9]" />
            )}
          </button>
          <button
            className={`relative flex h-full items-center justify-center px-5 ${
              activeTab === 'work'
                ? 'text-gray-900 font-semibold'
                : 'text-gray-500'
            }`}
            onClick={() => onTabChange('work')}
          >
            Work
            {activeTab === 'work' && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#4ABED9]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 