import { Bone, LoadingStatus } from "@/components/ui/Skeleton";

// Mirrors the admin PropertiesClient: header + Add Property, filter bar (two
// segmented controls + search, search first on phones), then listing cards
// with photos on phones / table rows with thumbnails on desktop.
export default function AdminPropertiesLoading() {
  return (
    <LoadingStatus label="Loading listings" className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Bone className="h-7 w-32 mb-2" />
          <Bone className="h-4 w-24" />
        </div>
        <Bone className="h-10 w-36 rounded-xl" />
      </div>

      <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-3 sm:p-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <Bone className="h-11 w-full lg:w-80 rounded-xl" />
        <Bone className="h-11 w-full lg:w-52 rounded-xl" />
        <Bone className="h-11 w-full lg:w-64 rounded-xl order-first lg:order-last lg:ml-auto" />
      </div>

      <div className="bg-luxury-800 border border-luxury-700 rounded-2xl overflow-hidden">
        <div className="lg:hidden divide-y divide-luxury-700/50">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 flex gap-4">
              <Bone className="w-20 h-20 rounded-xl shrink-0" />
              <div className="flex-1 min-w-0">
                <Bone className="h-4 w-full" />
                <Bone className="h-4 w-2/3 mt-2" />
                <Bone className="h-3 w-1/2 mt-2.5" />
                <Bone className="h-4 w-24 mt-2.5" />
              </div>
            </div>
          ))}
        </div>
        <div className="hidden lg:block">
          <div className="px-4 py-3.5 border-b border-luxury-700 bg-luxury-900/40 flex gap-6">
            <Bone className="h-3 flex-1" />
            <Bone className="h-3 w-24" />
            <Bone className="h-3 w-14" />
            <Bone className="h-3 w-20" />
            <Bone className="h-3 w-16" />
            <Bone className="h-3 w-16" />
          </div>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="px-4 py-3 border-b border-luxury-700/50 last:border-0 flex items-center gap-6">
              <div className="flex-1 flex items-center gap-3 min-w-0">
                <Bone className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1">
                  <Bone className="h-4 w-3/4" />
                  <Bone className="h-3 w-1/2 mt-2" />
                </div>
              </div>
              <Bone className="h-4 w-24" />
              <Bone className="h-6 w-14 rounded-full" />
              <Bone className="h-6 w-20 rounded-full" />
              <Bone className="h-4 w-16" />
              <Bone className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </LoadingStatus>
  );
}
