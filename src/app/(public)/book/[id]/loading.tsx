import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Tombol Back Skeleton */}
        <Skeleton className="h-6 w-32 mb-8" />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Kiri: Cover Skeleton */}
            <div className="md:col-span-4 h-[400px] md:h-[600px] bg-slate-100 p-8 flex items-center justify-center">
              <Skeleton className="h-[80%] w-[70%] rounded-lg bg-slate-200" />
            </div>

            {/* Kanan: Info Skeleton */}
            <div className="md:col-span-8 p-8 md:p-12">
              <Skeleton className="h-6 w-20 mb-4" /> {/* Badge */}
              <Skeleton className="h-12 w-[80%] mb-4" /> {/* Title */}
              <Skeleton className="h-8 w-[40%] mb-8" /> {/* Author */}

              <div className="flex gap-8 mb-8">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>

              <div className="space-y-3 mb-8">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[60%]" />
              </div>

              <div className="flex gap-4">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}