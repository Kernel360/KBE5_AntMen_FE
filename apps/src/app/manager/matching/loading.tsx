const MatchingRequestSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="w-12 h-6 bg-gray-200 rounded-2xl"></div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 mb-3"></div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-2xl"></div>
        <div className="flex-1 h-10 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  );
};

const ManagerMatchingLoading = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-5">
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
        <div className="w-6 h-6"></div> {/* Spacer for alignment */}
      </header>

      {/* Content */}
      <div className="p-4">
        {/* Filter Tabs */}
        <section className="flex gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="px-4 h-9 bg-gray-200 rounded-2xl animate-pulse w-16"
            ></div>
          ))}
        </section>

        {/* Matching Requests List */}
        <section className="space-y-4">
          {[1, 2, 3].map((i) => (
            <MatchingRequestSkeleton key={i} />
          ))}
        </section>
      </div>
    </main>
  );
};

export default ManagerMatchingLoading; 