import type { Category } from '@/shared/types/reservation';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (id: number) => void;
}

export const CategoryTabs = ({ categories, selectedCategory, onSelectCategory }: CategoryTabsProps) => {
  return (
    <div className="border-b border-[#EEEEEE]">
      <div className="px-4">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`py-3 whitespace-nowrap relative ${
                category.id === selectedCategory
                  ? 'text-primary font-bold'
                  : 'text-[#666666]'
              }`}
            >
              {category.name}
              {category.id === selectedCategory && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 