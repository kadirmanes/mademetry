import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, FileText, Package, LogOut, Upload, Download } from "lucide-react";
import { useLocation } from "wouter";
import type { QuoteWithFiles } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import logoUrl from "@assets/Logo (2)_1762350189592.png";
import { useState } from "react";

export default function AdminPanel() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        setLocation("/login");
      }, 500);
      return;
    }

    if (!isLoading && user?.isAdmin !== 1) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, user, toast, setLocation]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.isAdmin !== 1) {
    return null;
  }

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <div className="p-6 border-b flex items-center gap-3">
            <img src={logoUrl} alt="ManHUB" className="h-8 w-auto" />
            <span className="text-lg font-bold">ManHUB</span>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === "/dashboard"} data-testid="nav-dashboard">
                      <a href="/dashboard">
                        <Home className="w-4 h-4" />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === "/admin"} data-testid="nav-admin">
                      <a href="/admin">
                        <Package className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={async () => {
                        try {
                          await fetch("/api/logout", { method: "POST" });
                          window.location.href = "/login";
                        } catch (error) {
                          console.error("Logout failed:", error);
                        }
                      }}
                      data-testid="nav-logout"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-8">
            <AdminContent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AdminContent() {
  const { data: allQuotes = [] } = useQuery<QuoteWithFiles[]>({
    queryKey: ["/api/admin/quotes"],
  });

  const stats = {
    total: allQuotes.length,
    pending: allQuotes.filter((q) => q.status === "quote_requested").length,
    quoted: allQuotes.filter((q) => q.status === "quote_provided").length,
    inProduction: allQuotes.filter((q) => ["order_confirmed", "in_production", "quality_check"].includes(q.status)).length,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8" data-testid="heading-admin-panel">Quote Management</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All Quotes</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-all-quotes">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-pending-review">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quoted</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-quoted">{stats.quoted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Production</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-in-production">{stats.inProduction}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Quote Requests</CardTitle>
          <CardDescription>Manage quotes from all users</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <AdminQuotesTable quotes={allQuotes} />
        </CardContent>
      </Card>
    </div>
  );
}

function AdminQuotesTable({ quotes }: { quotes: QuoteWithFiles[] }) {
  const { toast } = useToast();
  const [selectedQuote, setSelectedQuote] = useState<QuoteWithFiles | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState<string>("");

  const updateStatusMutation = useMutation({
    mutationFn: async ({ quoteId, status }: { quoteId: string; status: string }) => {
      return await apiRequest("PUT", `/api/admin/quotes/${quoteId}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Quote status has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
      setSelectedQuote(null);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const updatePriceMutation = useMutation({
    mutationFn: async ({ quoteId, price }: { quoteId: string; price: number }) => {
      return await apiRequest("PUT", `/api/admin/quotes/${quoteId}/price`, { finalPrice: price });
    },
    onSuccess: () => {
      toast({
        title: "Price Updated",
        description: "Quote price has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
      setFinalPrice("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update price",
        variant: "destructive",
      });
    },
  });

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12" data-testid="empty-state-admin-quotes">
        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No quotes yet</h3>
        <p className="text-muted-foreground">Quotes will appear here once users submit requests</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Part Name</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow key={quote.id} data-testid={`row-admin-quote-${quote.id}`}>
              <TableCell className="font-medium">{quote.partName || "Untitled"}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <p className="font-medium">{quote.user?.firstName} {quote.user?.lastName}</p>
                  <p className="text-muted-foreground text-xs">{quote.user?.email}</p>
                </div>
              </TableCell>
              <TableCell className="capitalize">{quote.service?.replace(/_/g, " ")}</TableCell>
              <TableCell>{quote.quantity}</TableCell>
              <TableCell>
                <StatusBadge status={quote.status as any} />
              </TableCell>
              <TableCell>
                {quote.finalPrice ? `$${parseFloat(quote.finalPrice).toFixed(2)}` : "-"}
              </TableCell>
              <TableCell>{new Date(quote.createdAt!).toLocaleDateString()}</TableCell>
              <TableCell className="text-right space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedQuote(quote);
                      setNewStatus(quote.status);
                      setFinalPrice(quote.finalPrice || "");
                    }} data-testid={`button-manage-quote-${quote.id}`}>
                      Manage
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Manage Quote</DialogTitle>
                      <DialogDescription>
                        Customer: {quote.user?.firstName} {quote.user?.lastName} ({quote.user?.email})
                        <br />
                        Update status and pricing for this quote
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {quote.files && quote.files.length > 0 && (
                        <div className="space-y-2">
                          <Label>Uploaded Files</Label>
                          <div className="space-y-2 border rounded-md p-3 bg-muted/50">
                            {quote.files.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center justify-between p-2 rounded-md hover-elevate bg-background"
                                data-testid={`admin-file-item-${file.id}`}
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-primary" />
                                  <div>
                                    <p className="text-sm font-medium">{file.fileName}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {file.fileSize ? `${(file.fileSize / 1024 / 1024).toFixed(2)} MB` : "Size unknown"}
                                    </p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" asChild data-testid={`button-admin-download-${file.id}`}>
                                  <a 
                                    href={`${file.filePath}?filename=${encodeURIComponent(file.fileName)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Quote Details</Label>
                        <div className="border rounded-md p-3 bg-muted/50 space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-muted-foreground">Part Name</p>
                              <p className="font-medium">{quote.partName || "-"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Service</p>
                              <p className="font-medium capitalize">{quote.service?.replace(/_/g, " ") || "-"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Material</p>
                              <p className="font-medium">{quote.material || "-"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Quantity</p>
                              <p className="font-medium">{quote.quantity || "-"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Finish Types</p>
                              <p className="font-medium">
                                {quote.finishTypes && quote.finishTypes.length > 0 
                                  ? quote.finishTypes.join(", ").replace(/_/g, " ")
                                  : "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Quality Standard</p>
                              <p className="font-medium capitalize">
                                {quote.qualityStandard?.replace(/_/g, " ") || "-"}
                              </p>
                            </div>
                          </div>
                          
                          {quote.measurementReports && quote.measurementReports.length > 0 && (
                            <div>
                              <p className="text-muted-foreground mb-1">Measurement Reports</p>
                              <div className="flex flex-wrap gap-1">
                                {quote.measurementReports.map((report) => (
                                  <span key={report} className="px-2 py-1 bg-background rounded-md text-xs">
                                    {report.replace(/_/g, " ").toUpperCase()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {quote.materialCertificates && quote.materialCertificates.length > 0 && (
                            <div>
                              <p className="text-muted-foreground mb-1">Material Certificates</p>
                              <div className="flex flex-wrap gap-1">
                                {quote.materialCertificates.map((cert) => (
                                  <span key={cert} className="px-2 py-1 bg-background rounded-md text-xs">
                                    {cert.replace(/_/g, " ").toUpperCase()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {quote.printingProcesses && quote.printingProcesses.length > 0 && (
                            <div>
                              <p className="text-muted-foreground mb-1">Printing Processes</p>
                              <div className="flex flex-wrap gap-1">
                                {quote.printingProcesses.map((process) => (
                                  <span key={process} className="px-2 py-1 bg-background rounded-md text-xs">
                                    {process.replace(/_/g, " ").toUpperCase()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {quote.coatings && quote.coatings.length > 0 && (
                            <div>
                              <p className="text-muted-foreground mb-1">Coatings</p>
                              <div className="flex flex-wrap gap-1">
                                {quote.coatings.map((coating) => (
                                  <span key={coating} className="px-2 py-1 bg-background rounded-md text-xs">
                                    {coating.replace(/_/g, " ").toUpperCase()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {quote.metalPlating && quote.metalPlating.length > 0 && (
                            <div>
                              <p className="text-muted-foreground mb-1">Metal Plating</p>
                              <div className="flex flex-wrap gap-1">
                                {quote.metalPlating.map((plating) => (
                                  <span key={plating} className="px-2 py-1 bg-background rounded-md text-xs">
                                    {plating.replace(/_/g, " ").toUpperCase()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {quote.heatTreatment && quote.heatTreatment.length > 0 && (
                            <div>
                              <p className="text-muted-foreground mb-1">Heat Treatment</p>
                              <div className="flex flex-wrap gap-1">
                                {quote.heatTreatment.map((treatment) => (
                                  <span key={treatment} className="px-2 py-1 bg-background rounded-md text-xs">
                                    {treatment.replace(/_/g, " ").toUpperCase()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {quote.notes && (
                            <div>
                              <p className="text-muted-foreground mb-1">Additional Notes</p>
                              <p className="text-sm bg-background p-2 rounded-md">{quote.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Update Status</Label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger data-testid="select-new-status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quote_requested">Quote Requested</SelectItem>
                            <SelectItem value="quote_provided">Quote Provided</SelectItem>
                            <SelectItem value="order_confirmed">Order Confirmed</SelectItem>
                            <SelectItem value="in_production">In Production</SelectItem>
                            <SelectItem value="quality_check">Quality Check</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={() => updateStatusMutation.mutate({ quoteId: quote.id, status: newStatus })}
                          disabled={updateStatusMutation.isPending || newStatus === quote.status}
                          data-testid="button-update-status"
                        >
                          {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Set Final Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Enter final quote price"
                          value={finalPrice}
                          onChange={(e) => setFinalPrice(e.target.value)}
                          data-testid="input-final-price"
                        />
                        <Button
                          onClick={() => {
                            const price = parseFloat(finalPrice);
                            if (price > 0) {
                              updatePriceMutation.mutate({ quoteId: quote.id, price });
                            }
                          }}
                          disabled={updatePriceMutation.isPending || !finalPrice || parseFloat(finalPrice) <= 0}
                          data-testid="button-update-price"
                        >
                          {updatePriceMutation.isPending ? "Updating..." : "Update Price"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
