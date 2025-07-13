import { lazy, Suspense, ComponentType } from "react";
import { Card, CardContent } from "@/components/ui/card";

// Lazy load heavy components for better performance
export const LazyDashboard = lazy(() => 
  import("../dashboard/Dashboard").then(module => ({ default: module.Dashboard }))
);

export const LazySubjectDetail = lazy(() => 
  import("../subjects/SubjectDetail").then(module => ({ default: module.SubjectDetail }))
);

export const LazyLessonDetail = lazy(() => 
  import("../lessons/LessonDetail").then(module => ({ default: module.LessonDetail }))
);

export const LazyProgressAnalytics = lazy(() => 
  import("../learning/ProgressAnalytics").then(module => ({ default: module.ProgressAnalytics }))
);

// Enhanced loading component with skeleton
const EnhancedLoading = ({ type = "default" }: { type?: "default" | "dashboard" | "lesson" }) => {
  const skeletons = {
    default: (
      <div className="animate-spring-in space-y-4">
        <div className="h-8 bg-muted/50 rounded-lg animate-shimmer" />
        <div className="h-32 bg-muted/50 rounded-lg animate-shimmer" />
        <div className="h-16 bg-muted/50 rounded-lg animate-shimmer" />
      </div>
    ),
    dashboard: (
      <div className="space-y-6 animate-spring-in">
        {/* Header skeleton */}
        <div className="h-24 bg-gradient-primary/20 rounded-lg animate-shimmer" />
        
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-shimmer">
              <CardContent className="p-6">
                <div className="h-16 bg-muted/50 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-6 bg-muted/50 rounded animate-shimmer" />
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-shimmer">
                <CardContent className="p-6">
                  <div className="h-24 bg-muted/50 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <div className="h-6 bg-muted/50 rounded animate-shimmer mb-4" />
            <Card className="animate-shimmer">
              <CardContent className="p-6">
                <div className="h-48 bg-muted/50 rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    ),
    lesson: (
      <div className="space-y-6 animate-spring-in">
        {/* Header */}
        <div className="h-32 bg-gradient-primary/20 rounded-lg animate-shimmer" />
        
        {/* Tabs */}
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-muted/50 rounded animate-shimmer" />
          ))}
        </div>
        
        {/* Content */}
        <Card className="animate-shimmer">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-6 bg-muted/50 rounded animate-shimmer" />
              <div className="h-4 bg-muted/50 rounded animate-shimmer w-3/4" />
              <div className="h-4 bg-muted/50 rounded animate-shimmer w-1/2" />
              <div className="h-24 bg-muted/50 rounded animate-shimmer" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="max-w-6xl mx-auto">
        {skeletons[type]}
      </div>
    </div>
  );
};

// HOC for lazy loading with enhanced loading states
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  loadingType: "default" | "dashboard" | "lesson" = "default"
) => {
  return (props: P) => (
    <Suspense fallback={<EnhancedLoading type={loadingType} />}>
      <Component {...props} />
    </Suspense>
  );
};

// Pre-configured lazy components with appropriate loading states
export const DashboardWithLoading = withLazyLoading(LazyDashboard, "dashboard");
export const SubjectDetailWithLoading = withLazyLoading(LazySubjectDetail, "lesson");
export const LessonDetailWithLoading = withLazyLoading(LazyLessonDetail, "lesson");
export const ProgressAnalyticsWithLoading = withLazyLoading(LazyProgressAnalytics, "default");