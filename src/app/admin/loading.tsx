export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-luxury-700 rounded-lg w-40 mb-2" />
          <div className="h-4 bg-luxury-700 rounded-lg w-24" />
        </div>
        <div className="h-10 bg-luxury-700 rounded-xl w-36" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6">
            <div className="w-10 h-10 bg-luxury-700 rounded-xl mb-4" />
            <div className="h-8 bg-luxury-700 rounded-lg w-16 mb-2" />
            <div className="h-4 bg-luxury-700 rounded-lg w-24" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6 h-80" />
        <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6 h-80" />
      </div>
      <div className="bg-luxury-800 border border-luxury-700 rounded-2xl h-64" />
    </div>
  );
}