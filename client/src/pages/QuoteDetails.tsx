import { useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { OrderTimeline } from "@/components/OrderTimeline";
import { FileText, Download, ArrowLeft } from "lucide-react";
import type { QuoteWithFiles } from "@shared/schema";
import { useLocation } from "wouter";

export default function QuoteDetails() {
  const [, params] = useRoute("/dashboard/quotes/:id");
  const [, setLocation] = useLocation();
  const quoteId = params?.id;

  const { data: quote, isLoading } = useQuery<QuoteWithFiles>({
    queryKey: ["/api/quotes", quoteId],
    enabled: !!quoteId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading quote details...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Quote not found</h3>
          <p className="text-muted-foreground mb-4">The quote you're looking for doesn't exist</p>
          <Button onClick={() => setLocation("/dashboard/quotes")}>Back to Quotes</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => setLocation("/dashboard/quotes")} className="mb-4" data-testid="button-back-to-quotes">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quotes
        </Button>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2" data-testid="heading-quote-details">
              {quote.partName || "Untitled Quote"}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Quote ID: {quote.id}</span>
              <span>•</span>
              <span>Created {new Date(quote.createdAt!).toLocaleDateString()}</span>
            </div>
          </div>
          <StatusBadge status={quote.status as any} />
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Timeline</CardTitle>
            <CardDescription>Track your order from quote to delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderTimeline currentStatus={quote.status as any} statusHistory={quote.statusHistory} />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Part Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Service</div>
                <div className="capitalize" data-testid="text-service">{quote.service?.replace(/_/g, " ")}</div>
              </div>
              {quote.material && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Material</div>
                  <div data-testid="text-material">{quote.material}</div>
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Quantity</div>
                <div data-testid="text-quantity">{quote.quantity}</div>
              </div>
              {quote.finishTypes && quote.finishTypes.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Finish Types</div>
                  <div className="flex flex-wrap gap-2">
                    {quote.finishTypes.map((finish) => (
                      <span key={finish} className="px-2 py-1 bg-muted rounded-md text-sm capitalize" data-testid={`badge-finish-${finish}`}>
                        {finish.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {quote.qualityStandard && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Quality Standard (ISO 2768)</div>
                  <div className="uppercase" data-testid="text-quality-standard">{quote.qualityStandard}</div>
                </div>
              )}
              {quote.notes && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Notes</div>
                  <div className="text-sm" data-testid="text-notes">{quote.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quote.targetPrice && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Target Price</div>
                  <div className="text-lg font-bold" data-testid="text-target-price">${parseFloat(quote.targetPrice).toFixed(2)}</div>
                </div>
              )}
              {quote.finalPrice && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Final Quote Price</div>
                  <div className="text-3xl font-bold text-primary" data-testid="text-final-price">${parseFloat(quote.finalPrice).toFixed(2)}</div>
                </div>
              )}
              {!quote.finalPrice && (
                <div className="text-muted-foreground" data-testid="text-pricing-pending">
                  Pricing will be provided once we review your quote request
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({quote.files?.length || 0})</CardTitle>
            <CardDescription>CAD files attached to this quote</CardDescription>
          </CardHeader>
          <CardContent>
            {quote.files && quote.files.length > 0 ? (
              <div className="space-y-2">
                {quote.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border rounded-md hover-elevate"
                    data-testid={`file-item-${file.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{file.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {file.fileSize ? `${(file.fileSize / 1024 / 1024).toFixed(2)} MB` : "Size unknown"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild data-testid={`button-download-${file.id}`}>
                      <a href={file.filePath} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground" data-testid="empty-state-files">
                No files uploaded
              </div>
            )}
          </CardContent>
        </Card>

        {quote.quoteDocumentPath && (
          <Card>
            <CardHeader>
              <CardTitle>Quote Document</CardTitle>
              <CardDescription>Official quote from ManHUB</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild data-testid="button-download-quote-doc">
                <a href={quote.quoteDocumentPath} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download Quote PDF
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
