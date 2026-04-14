import { useEffect, useState } from 'react';
import { useNetworkStatus } from './useNetworkStatus';

export function useOfflinePreloader() {
  const [isReady, setIsReady] = useState(false);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    // We will build the new V0.6 Sync protocol here in the next phase!
    // For now, instantly clear the preloader to let the app load.
    setIsReady(true);
  }, [isOnline]);

  return { isReady };
}
