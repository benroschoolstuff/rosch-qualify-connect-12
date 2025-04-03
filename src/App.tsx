
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TeamPage from "./pages/TeamPage";
import QualificationsPage from "./pages/QualificationsPage";
import QualificationDetail from "./pages/QualificationDetail";
import BeginTraining from "./pages/BeginTraining";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Setup from "./pages/Setup";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import ManagementBackend from "./pages/ManagementBackend";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import WithDatabaseCheck from "./components/maintenance/WithDatabaseCheck";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DatabaseProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <WithDatabaseCheck>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/qualifications" element={<QualificationsPage />} />
              <Route path="/qualification/:id" element={<QualificationDetail />} />
              <Route path="/begin-training" element={<BeginTraining />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/discord/callback" element={<AuthCallback />} />
              <Route path="/managementbackend" element={
                <ProtectedRoute>
                  <ManagementBackend />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </WithDatabaseCheck>
        </BrowserRouter>
      </TooltipProvider>
    </DatabaseProvider>
  </QueryClientProvider>
);

export default App;
