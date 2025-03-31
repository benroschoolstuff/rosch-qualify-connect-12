
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrandProvider } from "@/contexts/BrandContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import TeamPage from "./pages/TeamPage";
import QualificationsPage from "./pages/QualificationsPage";
import QualificationDetail from "./pages/QualificationDetail";
import BeginTraining from "./pages/BeginTraining";
import AdminSettings from "./pages/AdminSettings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import DiscordCallback from "./pages/DiscordCallback";
import DiscordSetup from "./pages/DiscordSetup";
import DiscordSetupGuard from "./components/auth/DiscordSetupGuard";
import InitialSetup from "./pages/InitialSetup";
import InitialSetupGuard from "./components/auth/InitialSetupGuard";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrandProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/auth/discord/callback" element={<DiscordCallback />} />
              <Route path="/contact" element={<Contact />} />
              <Route 
                path="/initial-setup" 
                element={
                  <InitialSetupGuard>
                    <InitialSetup />
                  </InitialSetupGuard>
                } 
              />
              <Route 
                path="/discord-setup" 
                element={
                  <DiscordSetupGuard>
                    <DiscordSetup />
                  </DiscordSetupGuard>
                } 
              />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/qualifications" element={<QualificationsPage />} />
              <Route path="/qualification/:id" element={<QualificationDetail />} />
              <Route path="/begin-training" element={<BeginTraining />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BrandProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
