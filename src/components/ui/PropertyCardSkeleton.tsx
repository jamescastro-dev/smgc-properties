export default function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col bg-luxury-800 border border-luxury-700 rounded-2xl overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-luxury-700" />

      {/* Content skeleton */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="h-4 bg-luxury-700 rounded-md w-3/4" />
        <div className="h-3 bg-luxury-700 rounded-md w-1/2" />
        <div className="h-3 bg-luxury-700 rounded-md w-2/3" />
        <div className="border-t border-luxury-700 mt-auto pt-4">
          <div className="flex items-center gap-4">
            <div className="h-3 bg-luxury-700 rounded-md w-16" />
            <div className="h-3 bg-luxury-700 rounded-md w-16" />
            <div className="h-3 bg-luxury-700 rounded-md w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}