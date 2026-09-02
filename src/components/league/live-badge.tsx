import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function LiveBadge({ className }: { className?: string }) {
  return (
    <Badge variant="live" className={cn(className)}>
      <span className="size-1.5 rounded-full bg-live" />
      Live
    </Badge>
  );
}
