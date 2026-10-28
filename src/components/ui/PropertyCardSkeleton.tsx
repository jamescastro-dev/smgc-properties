import { Bone } from "./Skeleton";

/** Mirrors PropertyCard: photo, price + type, title, location, specs. */
export default function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col bg-luxury-800 border border-luxury-700 rounded-2xl overflow-hidden">
      <div className="aspect-4/3 bg-luxury-700" />
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <Bone className="h-6 w-24" />
          <Bone className="h-3 w-16" />
        </div>
        <Bone className="h-4 w-5/6 mt-3" />
        <Bone className="h-4 w-2/3 mt-2" />
        <Bone className="h-3 w-1/2 mt-3" />
        <div className="mt-auto pt-4">
          <div className="pt-3.5 flex gap-4 border-t border-luxury-700/70">
            <Bone className="h-3 w-12" />
            <Bone className="h-3 w-12" />
            <Bone className="h-3 w-14" />
          </div>
        </div>
      </div>
    </div>
  );
}
