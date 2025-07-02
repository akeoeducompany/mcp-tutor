import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SetGoals from "./pages/SetGoals";
import Tutoring from "./pages/Tutoring";
import Report from "./pages/Report";
import NotFound from "./pages/NotFound";
import DemoOne from "./pages/DemoOne";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SetGoals />} />
          <Route path="/tutoring" element={<Tutoring />} />
          <Route path="/report" element={<Report />} />
          <Route path="/demo" element={<DemoOne />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
