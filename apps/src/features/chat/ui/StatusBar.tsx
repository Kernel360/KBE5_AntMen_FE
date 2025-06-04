export default function StatusBar() {
  return (
    <div className="flex justify-between items-center px-5 py-2">
      <span className="text-[17px] font-semibold">10:25</span>
      <div className="flex items-center gap-[5px]">
        <span className="text-[17px]">••••</span>
        <span className="text-[17px]">📶</span>
        <div className="w-6 h-3 bg-[#FF3B30] rounded-[6px] border border-black" />
      </div>
    </div>
  );
} 