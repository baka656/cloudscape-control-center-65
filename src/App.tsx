
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";

// Pages
import Dashboard from "./pages/Dashboard";
import Submissions from "./pages/Submissions";
import Validation from "./pages/Validation";
import Reports from "./pages/Reports";
import TechControls from "./pages/TechControls";
import CalibrationGuides from "./pages/CalibrationGuides";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [mounted, setMounted] = useState(false);

  // Ensure theme is applied after component mounts to prevent initial flash
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<AppShell />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/submissions" element={<Submissions />} />
                <Route path="/validation" element={<Validation />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/tech-controls" element={<TechControls />} />
                <Route path="/calibration-guides" element={<CalibrationGuides />} />
                <Route path="/users" element={<Users />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
