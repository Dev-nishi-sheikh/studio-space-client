import { Skeleton, StudioGridSkeleton } from "@/components/ui/skeleton";

export default function StudiosLoading() {
  return (
    <>
      <div className="border-b border-border">
        <div className="container-x py-16 sm:py-20">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-5 h-14 w-full max-w-xl" />
          <Skeleton className="mt-4 h-4 w-full max-w-2xl" />
        </div>
      </div>
      <div className="container-x py-10">
        <Skeleton className="h-[8.5rem] w-full rounded-[1.5rem]" />
        <div className="mt-8">
          <StudioGridSkeleton count={6} />
        </div>
      </div>
    </>
  );
}
