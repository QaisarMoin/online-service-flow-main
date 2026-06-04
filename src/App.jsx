import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./hooks/useTranslation";
import Index from "./pages/Index";
import ServiceDetail from "./pages/ServiceDetail";
import ServiceApplication from "./pages/ServiceApplication";
import AdminDashboard from "./pages/AdminDashboard";
import CreateService from "./pages/admin/CreateService";
import EditService from "./pages/admin/EditService";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import ApplicationSuccess from "./pages/ApplicationSuccess";
import { FloatingChat } from "./components/FloatingChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/service/:serviceId" element={<ServiceDetail />} />
            <Route path="/apply/:serviceId" element={<ServiceApplication />} />
            <Route path="/success/:applicationId" element={<ApplicationSuccess />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/create-service" element={<CreateService />} />
            <Route path="/admin/edit-service/:serviceId" element={<EditService />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingChat />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
