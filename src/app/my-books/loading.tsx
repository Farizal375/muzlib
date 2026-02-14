import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-slate-50">
      <div className="mb-8 border-b border-slate-200 pb-4">
        <Skeleton className="h-10 w-48 mb-2" /> {/* Judul */}
        <Skeleton className="h-5 w-32" /> {/* Subtitle */}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
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