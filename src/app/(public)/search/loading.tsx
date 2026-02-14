import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col items-center mb-8 gap-4">
        <Skeleton className="h-10 w-48" /> {/* Title Skeleton */}
        <Skeleton className="h-10 w-full max-w-sm" /> {/* SearchBar Skeleton */}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Render 10 kartu loading dummy */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}