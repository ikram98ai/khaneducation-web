import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { refreshToken as refreshTokenApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { refreshToken, isAuthenticated, clearAuth, setAuth, setLoading } =
    useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    // Check and refresh token on app startup
    const checkTokenValidity = async () => {
      if (!refreshToken || !isAuthenticated) {
        return;
      }

      try {
        setLoading(true);
        const response = await refreshTokenApi(refreshToken);

        // Update the access token in store
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          setAuth(currentUser, response.access, refreshToken);
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        clearAuth();
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkTokenValidity();
  }, [refreshToken, isAuthenticated, clearAuth, setAuth, setLoading, toast]);

  // Set up periodic token refresh
  useEffect(() => {
    if (!isAuthenticated || !refreshToken) {
      return;
    }

    // Refresh token every 14 minutes (assuming 15-minute token expiry)
    const interval = setInterval(async () => {
      try {
        const response = await refreshTokenApi(refreshToken);
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          setAuth(currentUser, response.access, refreshToken);
        }
      } catch (error) {
        console.error("Periodic token refresh failed:", error);
        clearAuth();
      }
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshToken, setAuth, clearAuth]);

  return <>{children}</>;
};
