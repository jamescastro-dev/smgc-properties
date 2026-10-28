import { Bone, LoadingStatus } from "./Skeleton";
import PropertyGridSkeleton from "./PropertyGridSkeleton";

/**
 * Loading screen for the town (/locations/[slug]) and development
 * (/subdivisions/[slug]) pages, which share one layout: breadcrumb, heading
 * and intro, three key-fact cards, then the listing grid.
 */
export default function HubPageSkeleton({ label }: { label: string }) {
  return (
    <main className="min-h-screen bg-luxury-900 pt-16 sm:pt-[93px]">
      <LoadingStatus label={label} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Bone className="h-3 w-48 mb-6" />
        <div className="max-w-3xl">
          <Bone className="h-10 sm:h-12 w-3/4" />
          <Bone className="h-4 w-1/2 mt-4" />
          <div className="mt-6 flex flex-col gap-2.5">
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-2/3" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-luxury-800 border border-luxury-700 rounded-2xl p-5">
              <Bone className="h-3 w-24" />
              <Bone className="h-6 w-32 mt-3" />
            </div>
          ))}
        </div>

        <Bone className="h-8 w-64 mt-14 mb-6" />
        <PropertyGridSkeleton count={3} />
      </LoadingStatus>
    </main>
  );
}
