import { Bone, LoadingStatus } from "@/components/ui/Skeleton";
import PropertyGridSkeleton from "@/components/ui/PropertyGridSkeleton";

// /properties renders on every request (filters live in the URL). Mirrors
// PropertiesClient: header, filter bar, count + sort row, card grid. Filter
// changes made on the page itself keep the old results (dimmed) instead.
export default function PropertiesLoading() {
  return (
    <main className="min-h-screen bg-luxury-900 pt-16 sm:pt-[93px]">
      <LoadingStatus label="Loading properties" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Bone className="h-3 w-28 mb-4" />
          <Bone className="h-10 w-48" />
          <Bone className="h-4 w-full max-w-md mt-3" />
        </div>

        <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-3 sm:p-4 mb-6 grid grid-cols-2 lg:grid-cols-[minmax(0,1fr)_13rem_11rem_11rem] gap-3">
          <Bone className="h-11 col-span-2 lg:col-span-1" />
          <Bone className="h-11" />
          <Bone className="h-11" />
          <Bone className="h-11 col-span-2 lg:col-span-1" />
        </div>

        <div className="flex items-center justify-between gap-3 mb-5">
          <Bone className="h-4 w-36" />
          <Bone className="h-9 w-36" />
        </div>

        <PropertyGridSkeleton count={6} />
      </LoadingStatus>
    </main>
  );
}
