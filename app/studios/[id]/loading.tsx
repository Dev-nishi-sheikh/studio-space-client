import { Skeleton } from "@/components/ui/skeleton";

export default function StudioDetailsLoading() {
  return (
    <div className="container-x pb-16 pt-8">
      <Skeleton className="h-3 w-52" />
      <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:justify-between">
        <div className="w-full space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-14 w-full max-w-xl" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>
      <Skeleton className="mt-8 h-[430px] w-full rounded-[1.5rem]" />
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </div>
        </div>
        <Skeleton className="h-[420px] w-full rounded-[1.5rem]" />
      </div>
    </div>
  );
}
