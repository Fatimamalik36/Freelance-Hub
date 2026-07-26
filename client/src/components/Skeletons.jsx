export const CardSkeleton = () => (
  <div className="glass-card p-5 space-y-4">
    <div className="skeleton h-32 w-full rounded-xl" />
    <div className="skeleton h-4 w-3/4 rounded" />
    <div className="skeleton h-4 w-1/2 rounded" />
    <div className="flex gap-2">
      <div className="skeleton h-6 w-16 rounded-full" />
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
  </div>
);

export const GridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const RowSkeleton = () => (
  <div className="glass-card p-5 flex items-center gap-4">
    <div className="skeleton h-14 w-14 rounded-full shrink-0" />
    <div className="flex-1 space-y-3">
      <div className="skeleton h-4 w-1/3 rounded" />
      <div className="skeleton h-3 w-2/3 rounded" />
    </div>
  </div>
);
