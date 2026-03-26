export default function AdminLeadsLoading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div>
        <div className="h-8 bg-luxury-700 rounded-lg w-24 mb-2" />
        <div className="h-4 bg-luxury-700 rounded-lg w-32" />
      </div>
      <div className="bg-luxury-800 border border-luxury-700 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-luxury-700">
          <div className="h-4 bg-luxury-700 rounded w-full" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-luxury-700 flex gap-4">
            <div className="h-4 bg-luxury-700 rounded flex-1" />
            <div className="h-4 bg-luxury-700 rounded w-24" />
            <div className="h-4 bg-luxury-700 rounded w-16" />
            <div className="h-4 bg-luxury-700 rounded w-20" />
            <div className="h-4 bg-luxury-700 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}