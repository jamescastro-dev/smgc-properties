import { Bone, LoadingStatus } from "@/components/ui/Skeleton";

// Mirrors LeadsClient: header, filter bar (search first on phones), then lead
// cards on phones / table rows on desktop.
export default function AdminLeadsLoading() {
  return (
    <LoadingStatus label="Loading leads" className="flex flex-col gap-5">
      <div>
        <Bone className="h-7 w-24 mb-2" />
        <Bone className="h-4 w-32" />
      </div>

      <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-3 sm:p-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <Bone className="h-11 w-full lg:w-96 rounded-xl" />
        <Bone className="h-11 w-full lg:w-64 rounded-xl order-first lg:order-last lg:ml-auto" />
      </div>

      <div className="bg-luxury-800 border border-luxury-700 rounded-2xl overflow-hidden">
        <div className="lg:hidden divide-y divide-luxury-700/50">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <Bone className="h-5 w-32" />
                  <Bone className="h-4 w-28 mt-2" />
                </div>
                <Bone className="h-8 w-24 rounded-full" />
              </div>
              <Bone className="h-4 w-48" />
              <div className="grid grid-cols-2 gap-2">
                <Bone className="h-10" />
                <Bone className="h-10" />
              </div>
            </div>
          ))}
        </div>
        <div className="hidden lg:block">
          <div className="px-4 py-3.5 border-b border-luxury-700 bg-luxury-900/40 flex gap-6">
            <Bone className="h-3 flex-1" />
            <Bone className="h-3 w-28" />
            <Bone className="h-3 w-24" />
            <Bone className="h-3 w-20" />
            <Bone className="h-3 w-20" />
            <Bone className="h-3 w-24" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-4 py-4 border-b border-luxury-700/50 last:border-0 flex items-center gap-6">
              <div className="flex-1">
                <Bone className="h-4 w-32" />
                <Bone className="h-3 w-24 mt-2" />
              </div>
              <Bone className="h-6 w-28" />
              <Bone className="h-4 w-24" />
              <Bone className="h-4 w-20" />
              <Bone className="h-4 w-20" />
              <Bone className="h-7 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </LoadingStatus>
  );
}
