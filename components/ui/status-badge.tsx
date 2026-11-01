import { CalendarCheck, CircleCheck, CircleX, Clock } from "lucide-react";
import type { BookingStatus } from "@/lib/types";
import { badgeClass } from "@/lib/ui";
import { cn } from "@/lib/utils";

const config: Record<
  BookingStatus,
  { tone: "warning" | "success" | "info" | "danger"; icon: typeof Clock }
> = {
  Pending: { tone: "warning", icon: Clock },
  Confirmed: { tone: "success", icon: CalendarCheck },
  Completed: { tone: "info", icon: CircleCheck },
  Cancelled: { tone: "danger", icon: CircleX },
};

export function StatusBadge({
  status,
  className,
}: {
  status: BookingStatus;
  className?: string;
}) {
  const { tone, icon: Icon } = config[status] ?? config.Pending;
  return (
    <span className={badgeClass(tone, cn("normal-case tracking-[0.04em]", className))}>
      <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
      {status}
    </span>
  );
}
