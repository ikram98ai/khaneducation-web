import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { Wifi, WifiOff } from "lucide-react";

interface OfflineContextType {
  isOnline: boolean;
  downloadLesson: (lessonId: string) => Promise<void>;
  isLessonDownloaded: (lessonId: string) => boolean;
  downloadedLessons: string[];
  syncProgress: () => Promise<void>;
  pendingSync: boolean;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider = ({ children }: OfflineProviderProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadedLessons, setDownloadedLessons] = useState<string[]>([]);
  const [pendingSync, setPendingSync] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back online!",
        description: "Your connection has been restored.",
        duration: 3000,
      });
      
      // Auto-sync when coming back online
      if (pendingSync) {
        syncProgress();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Don't worry, you can still access downloaded lessons.",
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load downloaded lessons from localStorage
    const stored = localStorage.getItem('downloadedLessons');
    if (stored) {
      setDownloadedLessons(JSON.parse(stored));
    }

    // Check for pending sync
    const pendingData = localStorage.getItem('pendingSync');
    setPendingSync(!!pendingData);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const downloadLesson = async (lessonId: string) => {
    if (!isOnline) {
      toast({
        title: "Cannot download",
        description: "You need an internet connection to download lessons.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulate download process
      toast({
        title: "Downloading lesson...",
        description: "This may take a few moments.",
      });

      // Simulate API call and caching
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedLessons = [...downloadedLessons, lessonId];
      setDownloadedLessons(updatedLessons);
      localStorage.setItem('downloadedLessons', JSON.stringify(updatedLessons));

      toast({
        title: "Lesson downloaded!",
        description: "You can now access this lesson offline.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const isLessonDownloaded = (lessonId: string) => {
    return downloadedLessons.includes(lessonId);
  };

  const syncProgress = async () => {
    if (!isOnline) return;

    try {
      setPendingSync(true);
      
      // Simulate syncing progress data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.removeItem('pendingSync');
      setPendingSync(false);
      
      toast({
        title: "Progress synced!",
        description: "Your offline progress has been saved.",
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Will retry when connection improves.",
        variant: "destructive"
      });
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        downloadLesson,
        isLessonDownloaded,
        downloadedLessons,
        syncProgress,
        pendingSync
      }}
    >
      {children}
      
      {/* Connection Status Indicator */}
      <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isOnline ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="bg-warning/90 text-warning-foreground px-3 py-2 rounded-lg shadow-medium flex items-center gap-2 animate-spring-in">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">Offline Mode</span>
        </div>
      </div>
    </OfflineContext.Provider>
  );
};