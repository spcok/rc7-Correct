import { useEffect, useState } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { 
  animalsCollection, 
  dailyLogsCollection, 
  medicalLogsCollection, 
  usersCollection, 
  operationalListsCollection, 
  tasksCollection, 
  movementsCollection, 
  timesheetsCollection 
} from '../lib/database';

export function useOfflinePreloader() {
  const [isReady, setIsReady] = useState(false);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    async function preload() {
      try {
        const collections = [
          animalsCollection, dailyLogsCollection, medicalLogsCollection, 
          usersCollection, operationalListsCollection, tasksCollection, 
          movementsCollection, timesheetsCollection
        ];

        if (isOnline) {
          for (const col of collections) {
            if (col && typeof (col as any).sync === 'function') {
              await (col as any).sync();
            }
          }
        }
      } catch (error) {
        console.error('Preloader sync warning:', error);
      } finally {
        setIsReady(true);
      }
    }

    preload();
  }, [isOnline]);

  return { isReady };
}
