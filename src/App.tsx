
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import OnboardingPage from "./pages/OnboardingPage";
import ValuePropositionPage from "./pages/ValuePropositionPage";
import HeightWeightPage from "./pages/HeightWeightPage";
import WorkoutFrequencyPage from "./pages/WorkoutFrequencyPage";
import GoalSelectionPage from "./pages/GoalSelectionPage";
import GenderSelectionPage from "./pages/GenderSelectionPage";
import BirthdatePage from "./pages/BirthdatePage";
import CustomPlanPage from "./pages/CustomPlanPage";
import Dashboard from "./pages/Dashboard";
import ResultsPage from "./pages/ResultsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Check if user is already logged in
const isLoggedIn = () => {
  return localStorage.getItem("userLoggedIn") === "true";
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* If logged in, redirect to dashboard from home page */}
          <Route path="/" element={isLoggedIn() ? <Navigate to="/dashboard" /> : <Index />} />
          <Route path="/onboarding" element={<ValuePropositionPage />} />
          <Route path="/onboarding/step3" element={<HeightWeightPage />} />
          <Route path="/onboarding/step4" element={<WorkoutFrequencyPage />} />
          <Route path="/onboarding/goal" element={<GoalSelectionPage />} />
          <Route path="/onboarding/gender" element={<GenderSelectionPage />} />
          <Route path="/onboarding/birthdate" element={<BirthdatePage />} />
          <Route path="/onboarding/custom-plan" element={<CustomPlanPage />} />
          <Route path="/onboarding/step5" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<ResultsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
