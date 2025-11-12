import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface SubMethod {
  name: string;
  serviceType: string;
}

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  subMethods?: SubMethod[];
  className?: string;
}

export function ServiceCard({ icon: Icon, title, description, features, subMethods, className }: ServiceCardProps) {
  const [, setLocation] = useLocation();

  const handleSubMethodClick = (serviceType: string) => {
    setLocation(`/quote-request?service=${serviceType}`);
  };

  return (
    <Card className={cn("hover-elevate active-elevate-2 transition-all", className)} data-testid={`card-service-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader>
        <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold mb-2">{title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-primary mt-0.5">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {subMethods && subMethods.length > 0 && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Üretim Metodları:</p>
            <div className="flex flex-wrap gap-2">
              {subMethods.map((method) => (
                <Button
                  key={method.serviceType}
                  size="sm"
                  variant="outline"
                  onClick={() => handleSubMethodClick(method.serviceType)}
                  className="text-xs"
                  data-testid={`button-method-${method.serviceType}`}
                >
                  {method.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
