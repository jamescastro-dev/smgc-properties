import { Bone, LoadingStatus } from "@/components/ui/Skeleton";

// Mirrors PropertyDetailClient: breadcrumb + Share, 4:3 photo and thumbnails,
// details card (title, location, price, specs) beside the inquiry column.
export default function PropertyDetailLoading() {
  return (
    <main className="min-h-screen bg-luxury-900 pt-16 sm:pt-[93px]">
      <LoadingStatus label="Loading property">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between gap-4">
          <Bone className="h-3 w-64 max-w-[60%]" />
          <Bone className="h-10 w-24 shrink-0" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="aspect-4/3 rounded-2xl bg-luxury-800 border border-luxury-700" />
                <div className="flex gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Bone key={i} className="w-20 h-16 shrink-0" />
                  ))}
                </div>
              </div>

              <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 mb-6">
                  <div className="flex-1">
                    <Bone className="h-7 w-3/4" />
                    <Bone className="h-4 w-1/2 mt-3" />
                  </div>
                  <Bone className="h-8 w-40 shrink-0" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-luxury-900 border border-luxury-700" />
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-2.5">
                  <Bone className="h-4 w-full" />
                  <Bone className="h-4 w-full" />
                  <Bone className="h-4 w-2/3" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="hidden lg:flex gap-3">
                <Bone className="h-12 flex-1" />
                <Bone className="h-12 flex-1" />
              </div>
              <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6 flex flex-col gap-4">
                <Bone className="h-6 w-2/3" />
                <Bone className="h-3 w-full" />
                <Bone className="h-12 w-full mt-2" />
                <Bone className="h-12 w-full" />
                <Bone className="h-24 w-full" />
                <Bone className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </LoadingStatus>
    </main>
  );
}
