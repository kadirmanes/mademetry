import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import QuoteRequest from "@/pages/QuoteRequest";
import Dashboard from "@/pages/Dashboard";
import AdminPanel from "@/pages/AdminPanel";
import Certifications from "@/pages/Certifications";
import PostProcessing from "@/pages/PostProcessing";
import MassProduction from "@/pages/MassProduction";
import TargetPriceQuote from "@/pages/TargetPriceQuote";
import NotFound from "@/pages/not-found";

// Protected route wrapper that redirects to login if not authenticated
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation("/login");
  }, [setLocation]);
  
  return null;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading ? (
        <Route path="/" component={() => (
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        )} />
      ) : (
        <>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/" component={Landing} />
          <Route path="/certifications" component={Certifications} />
          <Route path="/post-processing" component={PostProcessing} />
          <Route path="/mass-production" component={MassProduction} />
          {isAuthenticated && (
            <>
              <Route path="/quote-request" component={QuoteRequest} />
              <Route path="/target-price-quote" component={TargetPriceQuote} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/dashboard/:rest*" component={Dashboard} />
              <Route path="/admin" component={AdminPanel} />
            </>
          )}
          {!isAuthenticated && (
            <>
              <Route path="/quote-request" component={ProtectedRoute} />
              <Route path="/target-price-quote" component={ProtectedRoute} />
            </>
          )}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
