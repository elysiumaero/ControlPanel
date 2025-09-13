import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Safety from "./pages/Safety";
import Arming from "./pages/Arming";
import Navigation from "./pages/Navigation";
import Communication from "./pages/Communication";
import ManualControl from "./pages/ManualControl";
import Diagnostics from "./pages/Diagnostics";
import { isAuthenticated } from "@/lib/auth";

const queryClient = new QueryClient();

function Protected({ children }: { children: JSX.Element }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route
            path="/safety"
            element={
              <Protected>
                <Safety />
              </Protected>
            }
          />
          <Route
            path="/arming"
            element={
              <Protected>
                <Arming />
              </Protected>
            }
          />
          <Route
            path="/navigation"
            element={
              <Protected>
                <Navigation />
              </Protected>
            }
          />
          <Route
            path="/communication"
            element={
              <Protected>
                <Communication />
              </Protected>
            }
          />
          <Route
            path="/manual-control"
            element={
              <Protected>
                <ManualControl />
              </Protected>
            }
          />
          <Route
            path="/diagnostics"
            element={
              <Protected>
                <Diagnostics />
              </Protected>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
