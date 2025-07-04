const SkeletonCard = () => (
  <div className="flex items-center rounded-2xl px-4 py-3 mb-3 bg-gray-100 animate-pulse" aria-hidden="true">
    <div className="w-8 h-8 rounded-full bg-gray-200 mr-3" />
    <div className="flex-1 min-w-0">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
    <div className="ml-3 px-4 py-1 rounded-full bg-gray-200 w-16 h-6" />
  </div>
);

const Loading = () => (
  <section aria-busy="true" aria-live="polite">
    <h1 className="text-2xl font-bold mb-4">오늘의 혜택</h1>
    {[...Array(6)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </section>
);

export default Loading