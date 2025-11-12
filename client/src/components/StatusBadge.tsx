import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@shared/schema";

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  quote_requested: {
    label: "Quote Requested",
    variant: "secondary" as const,
  },
  quote_provided: {
    label: "Quote Provided",
    variant: "default" as const,
  },
  order_confirmed: {
    label: "Order Confirmed",
    variant: "default" as const,
  },
  in_production: {
    label: "In Production",
    variant: "default" as const,
  },
  quality_check: {
    label: "Quality Check",
    variant: "default" as const,
  },
  shipped: {
    label: "Shipped",
    variant: "default" as const,
  },
  delivered: {
    label: "Delivered",
    variant: "default" as const,
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.quote_requested;
  
  return (
    <Badge variant={config.variant} data-testid={`badge-status-${status}`}>
      {config.label}
    </Badge>
  );
}
