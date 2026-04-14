import { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { queryClient } from './lib/queryClient';
import { useAuthStore } from './store/authStore';
import { router } from './router';
import ErrorBoundary from './components/ErrorBoundary';
import { useSupabaseRealtime } from './hooks/useSupabaseRealtime';
import { useOfflinePreloader } from './hooks/useOfflinePreloader';

// 1. THE OS EVICTION LOCK
function useStoragePersistence() {
  useEffect(() => {
    async function requestPersistence() {
      if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persisted();
        if (!isPersisted) {
          const granted = await navigator.storage.persist();
          console.log(`[Storage] Persistent storage granted: ${granted}`);
        } else {
          console.log('[Storage] Vault is already locked & persistent.');
        }
      }
    }
    requestPersistence();
  }, []);
}

function GlobalHooks() {
  useSupabaseRealtime();
  useStoragePersistence();
  return null;
}

export default function App() {
  const initialize = useAuthStore(state => state.initialize);
  const currentUser = useAuthStore(state => state.currentUser);

  // 2. THE HYDRATION LOCKS
  const [isAuthHydrated, setIsAuthHydrated] = useState(false);
  const { isReady: isSyncReady } = useOfflinePreloader(); // ACTIVATE THE SYNC ENGINE

  useEffect(() => {
    initialize().finally(() => {
      setIsAuthHydrated(true);
    });
  }, [initialize]);

  // Wait for BOTH Auth and Database Sync to be ready
  if (!isAuthHydrated || !isSyncReady) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">Establishing SQLite Connection & Syncing...</p>
      </div>
    );
  }

  const authContext = {
    isAuthenticated: !!currentUser,
    permissions: currentUser?.permissions,
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GlobalHooks />
        <RouterProvider router={router} context={{ auth: authContext }} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
