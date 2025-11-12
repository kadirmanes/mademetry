import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Route, Switch } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, FileText, Package, Settings as SettingsIcon, LogOut } from "lucide-react";
import type { Quote, QuoteWithFiles } from "@shared/schema";
import logoUrl from "@assets/Logo (2)_1762350189592.png";
import QuoteDetails from "./QuoteDetails";

export default function Dashboard() {
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
  }, [isAuthenticated, isLoading, toast]);

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

  if (!isAuthenticated) {
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
                    <SidebarMenuButton asChild isActive={location.startsWith("/dashboard/quotes")} data-testid="nav-quotes">
                      <a href="/dashboard/quotes">
                        <FileText className="w-4 h-4" />
                        <span>My Quotes</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {user?.isAdmin === 1 && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location === "/admin"} data-testid="nav-admin">
                        <a href="/admin">
                          <Package className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
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
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => setLocation("/quote-request")} data-testid="button-new-quote">
                New Quote Request
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Switch>
              <Route path="/dashboard/quotes/:id" component={QuoteDetails} />
              <Route path="/dashboard/quotes" component={QuotesList} />
              <Route path="/dashboard" component={DashboardHome} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function DashboardHome() {
  const { data: quotes = [] } = useQuery<Quote[]>({
    queryKey: ["/api/quotes"],
  });

  const stats = {
    total: quotes.length,
    pending: quotes.filter((q) => q.status === "quote_requested").length,
    inProgress: quotes.filter((q) => ["in_production", "quality_check"].includes(q.status)).length,
    completed: quotes.filter((q) => q.status === "delivered").length,
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8" data-testid="heading-dashboard">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-total-quotes">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-pending-quotes">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-in-progress">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-completed">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Quotes</CardTitle>
          <CardDescription>Your most recent quote requests</CardDescription>
        </CardHeader>
        <CardContent>
          <QuotesTable quotes={quotes.slice(0, 5)} />
        </CardContent>
      </Card>
    </div>
  );
}

function QuotesList() {
  const { data: quotes = [] } = useQuery<Quote[]>({
    queryKey: ["/api/quotes"],
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight" data-testid="heading-my-quotes">My Quotes</h1>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <QuotesTable quotes={quotes} />
        </CardContent>
      </Card>
    </div>
  );
}

function QuotesTable({ quotes }: { quotes: Quote[] }) {
  const [, setLocation] = useLocation();

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12" data-testid="empty-state-quotes">
        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No quotes yet</h3>
        <p className="text-muted-foreground mb-4">Get started by requesting a quote</p>
        <Button onClick={() => setLocation("/quote")}>Request Quote</Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Part Name</TableHead>
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
          <TableRow key={quote.id} className="hover-elevate cursor-pointer" onClick={() => setLocation(`/dashboard/quotes/${quote.id}`)} data-testid={`row-quote-${quote.id}`}>
            <TableCell className="font-medium">{quote.partName || "Untitled"}</TableCell>
            <TableCell className="capitalize">{quote.service?.replace(/_/g, " ")}</TableCell>
            <TableCell>{quote.quantity}</TableCell>
            <TableCell>
              <StatusBadge status={quote.status as any} />
            </TableCell>
            <TableCell data-testid={`text-price-${quote.id}`}>
              {quote.finalPrice ? `$${parseFloat(quote.finalPrice).toFixed(2)}` : <span className="text-muted-foreground">Pending</span>}
            </TableCell>
            <TableCell>{new Date(quote.createdAt!).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={(e) => {
                e.stopPropagation();
                setLocation(`/dashboard/quotes/${quote.id}`);
              }} data-testid={`button-view-quote-${quote.id}`}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
