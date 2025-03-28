"use client";

import { Skeleton } from "@/components/ui/skeleton";

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

export const TableSkeleton = ({
  rows = 5,
  columns = 3,
}: TableSkeletonProps) => {
  return (
    <div className="border rounded-md divide-y divide-muted">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center px-4 py-3 space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-[120px] flex-shrink-0" />
          ))}
        </div>
      ))}
    </div>
  );
};
