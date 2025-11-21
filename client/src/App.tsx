import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Activity } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import UploadPage from "@/pages/upload";
import Dashboard from "@/pages/dashboard";
import ReportDetail from "@/pages/report-detail";
import History from "@/pages/history";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={UploadPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/report/:id" component={ReportDetail} />
      <Route path="/history" component={History} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Header() {
  return (
    <header className="border-b sticky top-0 bg-background z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard">
          <div className="flex items-center gap-3 cursor-pointer hover-elevate p-2 rounded-lg" data-testid="link-home">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Doctor AI</h1>
              <p className="text-xs text-muted-foreground">Health Insights Platform</p>
            </div>
          </div>
        </Link>
        
        <nav className="flex items-center gap-2">
          <Link href="/dashboard">
            <span className="px-4 py-2 rounded-lg text-sm font-medium hover-elevate cursor-pointer" data-testid="link-dashboard">
              Dashboard
            </span>
          </Link>
          <Link href="/history">
            <span className="px-4 py-2 rounded-lg text-sm font-medium hover-elevate cursor-pointer" data-testid="link-history">
              History
            </span>
          </Link>
          <Link href="/">
            <span className="px-4 py-2 rounded-lg text-sm font-medium hover-elevate cursor-pointer" data-testid="link-upload">
              Upload
            </span>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
