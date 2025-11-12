import { Check } from "lucide-react";
import type { OrderStatus, QuoteStatusHistory } from "@shared/schema";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  statusHistory?: QuoteStatusHistory[];
}

const stages: { status: OrderStatus; label: string }[] = [
  { status: "quote_requested", label: "Quote Requested" },
  { status: "quote_provided", label: "Quote Provided" },
  { status: "order_confirmed", label: "Order Confirmed" },
  { status: "in_production", label: "In Production" },
  { status: "quality_check", label: "Quality Check" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

export function OrderTimeline({ currentStatus, statusHistory }: OrderTimelineProps) {
  const currentStageIndex = stages.findIndex((s) => s.status === currentStatus);

  const getStatusDate = (status: OrderStatus) => {
    const historyItem = statusHistory?.find((h) => h.status === status);
    if (historyItem?.createdAt) {
      return new Date(historyItem.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return null;
  };

  return (
    <div className="w-full py-8" data-testid="timeline-order-status">
      <div className="hidden md:flex items-center justify-between relative">
        {stages.map((stage, index) => {
          const isCompleted = index <= currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const statusDate = getStatusDate(stage.status);

          return (
            <div key={stage.status} className="flex flex-col items-center relative z-10" data-testid={`timeline-stage-${stage.status}`}>
              <div
                className={cn(
                  "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-border",
                  isCurrent && "ring-4 ring-primary/20 animate-pulse-subtle"
                )}
              >
                {isCompleted && <Check className="w-6 h-6" />}
              </div>
              <div className={cn("mt-3 text-sm font-medium text-center", isCompleted ? "text-foreground" : "text-muted-foreground")}>
                {stage.label}
              </div>
              {statusDate && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {statusDate}
                </div>
              )}
            </div>
          );
        })}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border -z-10">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {stages.map((stage, index) => {
          const isCompleted = index <= currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const statusDate = getStatusDate(stage.status);

          return (
            <div key={stage.status} className="flex items-start gap-4" data-testid={`timeline-stage-mobile-${stage.status}`}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-border",
                    isCurrent && "ring-4 ring-primary/20"
                  )}
                >
                  {isCompleted && <Check className="w-5 h-5" />}
                </div>
                {index < stages.length - 1 && (
                  <div className={cn("w-0.5 h-12 mt-2", isCompleted ? "bg-primary" : "bg-border")} />
                )}
              </div>
              <div className="flex-1 pt-2">
                <div className={cn("text-sm font-medium", isCompleted ? "text-foreground" : "text-muted-foreground")}>
                  {stage.label}
                </div>
                {statusDate && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {statusDate}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
