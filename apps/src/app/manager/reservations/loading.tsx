export function PageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-white animate-pulse">
      {/* Header Skeleton */}
      <header className="flex items-center justify-between p-5">
        <div className="h-6 w-6 rounded bg-gray-200" />
        <div className="h-7 w-32 rounded bg-gray-200" />
        <div className="h-6 w-6" />
      </header>
      {/* Tab Skeleton */}
      <div className="flex flex-col gap-4 px-5">
        <div className="flex gap-10">
          <div className="h-7 w-24 rounded bg-gray-200" />
          <div className="h-7 w-20 rounded bg-gray-200" />
        </div>
      </div>
      {/* Card List Skeleton */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="h-48 w-full rounded-xl bg-gray-200" />
        <div className="h-48 w-full rounded-xl bg-gray-200" />
      </div>
    </div>
  )
}

export default PageSkeleton; 