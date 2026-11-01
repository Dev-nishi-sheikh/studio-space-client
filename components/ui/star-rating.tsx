import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  count,
  size = 14,
  className,
  showValue = true,
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            width={size}
            height={size}
            className={
              index < Math.round(value)
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-border"
            }
            strokeWidth={1.8}
          />
        ))}
      </div>
      <span className="sr-only">{value} out of 5 stars</span>
      {showValue && (
        <span className="text-xs font-bold text-foreground">
          {value.toFixed(1)}
          {typeof count === "number" && (
            <span className="ml-1 font-medium text-muted">({count})</span>
          )}
        </span>
      )}
    </div>
  );
}
