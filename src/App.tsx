import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthForm } from "./components/auth/AuthForm";
import { ProfileSetup } from "./components/profile/ProfileSetup";
import { Dashboard } from "./components/dashboard/Dashboard";
import { SubjectDetail } from "./components/subjects/SubjectDetail";
import { LessonDetail } from "./components/lessons/LessonDetail";
import { ErrorBoundary } from "./components/error/ErrorBoundary";
import { AccessibilityProvider } from "./components/accessibility/AccessibilityProvider";
import { OfflineProvider } from "./components/offline/OfflineProvider";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <ErrorBoundary>
      <AccessibilityProvider>
        <OfflineProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<AuthForm />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/subjects/:subjectId"  element={<SubjectDetail />} />
                <Route path="/subjects/:subjectId/lessons/:lessonId" element={<LessonDetail />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              
            </Routes>
          </BrowserRouter>
        </OfflineProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  </TooltipProvider>
);

export default App;
