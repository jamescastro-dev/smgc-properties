import { Bone, LoadingStatus } from "@/components/ui/Skeleton";

// Mirrors the dashboard, including its phone order: follow-ups first, then
// KPIs, then the pipeline/inventory panels (desktop keeps source order).
export default function AdminLoading() {
  return (
    <LoadingStatus label="Loading dashboard" className="flex flex-col gap-6 w-full">
      {/* Header — date, greeting, subline (no action button) */}
      <div className="order-1 lg:order-none">
        <Bone className="h-3 w-44 mb-2" />
        <Bone className="h-7 w-56" />
        <Bone className="h-4 w-72 max-w-full mt-2" />
      </div>

      {/* KPI cards */}
      <div className="order-3 lg:order-none grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-luxury-800 border border-luxury-700 rounded-2xl p-5">
            <Bone className="w-9 h-9 rounded-xl mb-4" />
            <Bone className="h-8 w-14 mb-2" />
            <Bone className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Lead pipeline + inventory */}
      <div className="order-4 lg:order-none grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-luxury-800 border border-luxury-700 rounded-2xl p-5 sm:p-6">
            <Bone className="h-5 w-32 mb-2" />
            <Bone className="h-3 w-20 mb-6" />
            <div className="flex flex-col gap-5">
              <Bone className="h-2 w-full" />
              <Bone className="h-2 w-full" />
              <Bone className="h-2 w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Needs follow-up — cards on phones, table rows on desktop */}
      <div className="order-2 lg:order-none bg-luxury-800 border border-luxury-700 rounded-2xl">
        <div className="px-4 sm:px-6 py-4 border-b border-luxury-700 flex items-center justify-between gap-3">
          <Bone className="h-5 w-36" />
          <Bone className="h-4 w-16" />
        </div>
        <div className="lg:hidden p-4 flex flex-col gap-3">
          <Bone className="h-5 w-32" />
          <Bone className="h-4 w-24" />
          <Bone className="h-4 w-40" />
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Bone className="h-10" />
            <Bone className="h-10" />
          </div>
        </div>
        <div className="hidden lg:block">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-luxury-700/50 last:border-0 flex items-center gap-6">
              <Bone className="h-4 flex-1" />
              <Bone className="h-4 w-28" />
              <Bone className="h-4 w-12" />
              <Bone className="h-4 w-24" />
              <Bone className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </LoadingStatus>
  );
}
