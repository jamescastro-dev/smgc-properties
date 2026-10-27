import PropertyGridSkeleton from "@/components/ui/PropertyGridSkeleton";

export default function PropertiesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16 sm:pt-[89px]">
      <div className="mb-10">
        <div className="h-4 bg-luxury-800 rounded-md w-32 mb-4 animate-pulse" />
        <div className="h-10 bg-luxury-800 rounded-md w-48 mb-2 animate-pulse" />
        <div className="h-4 bg-luxury-800 rounded-md w-24 animate-pulse" />
      </div>
      <PropertyGridSkeleton count={6} />
    </div>
  );
}