import * as React from "react";
import { cn } from "@/lib/utils";

// Primitive skeleton bar
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#273647]/50", className)}
      {...props}
    />
  );
}

// Full page loader skeleton layout for dashboards
export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-6 w-full animate-pulse select-none", className)}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-[240px]" />
        <Skeleton className="h-6 w-[360px]" />
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="h-32 rounded-card" />
        <Skeleton className="h-32 rounded-card" />
        <Skeleton className="h-32 rounded-card" />
        <Skeleton className="h-32 rounded-card" />
      </div>

      {/* Main split dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Skeleton className="h-64 rounded-card" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-14 rounded-button" />
            <Skeleton className="h-14 rounded-button" />
          </div>
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-96 rounded-card" />
        </div>
      </div>
    </div>
  );
}

export default PageSkeleton;
