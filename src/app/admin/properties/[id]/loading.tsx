import { Bone, LoadingStatus } from "@/components/ui/Skeleton";

// Edit Property fetches the listing on the server. Without its own loading
// screen the previous page froze until it arrived (the parent's listings-table
// skeleton never showed). Mirrors PropertyForm: main column + settings column.
export default function EditPropertyLoading() {
  return (
    <LoadingStatus label="Loading listing" className="flex flex-col gap-6">
      <div>
        <Bone className="h-7 w-44 mb-2" />
        <Bone className="h-4 w-56" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-6">
          <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6 flex flex-col gap-5">
            <Bone className="h-5 w-36" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <Bone className="h-3 w-20 mb-2" />
                <Bone className="h-11 w-full rounded-xl" />
              </div>
            ))}
            <div>
              <Bone className="h-3 w-24 mb-2" />
              <Bone className="h-28 w-full rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Bone className="h-11 rounded-xl" />
              <Bone className="h-11 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Bone key={i} className="h-11 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6 flex flex-col gap-5">
            <Bone className="h-5 w-24" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Bone key={i} className="aspect-4/3 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6 flex flex-col gap-5">
            <Bone className="h-5 w-20" />
            <Bone className="h-11 w-full rounded-xl" />
            <Bone className="h-14 w-full rounded-xl" />
            <Bone className="h-11 w-full rounded-xl" />
          </div>
          <Bone className="hidden lg:block h-12 w-full rounded-xl" />
          <Bone className="hidden lg:block h-10 w-full rounded-xl" />
        </div>
      </div>
    </LoadingStatus>
  );
}
