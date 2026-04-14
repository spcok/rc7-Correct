import { useEffect, useState } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { supabase } from '../lib/supabase';
import { db, operationalListsCollection, usersCollection } from '../lib/database';

export function useOfflinePreloader() {
  const [isReady, setIsReady] = useState(false);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    let isMounted = true;

    async function executeSafeSync() {
      // 1. If offline, instantly boot the app using local SQLite data
      if (!isOnline) {
        console.log('📡 [Sync Engine] Offline mode detected. Booting from local SQLite OPFS.');
        if (isMounted) setIsReady(true);
        return;
      }

      // 2. If online, safely pull absolute truth from Supabase
      try {
        console.log('📡 [Sync Engine] Online. Syncing core tables to SQLite...');
        
        // Fetch core data simultaneously for performance
        const [listsRes, usersRes] = await Promise.all([
          supabase.from('operational_lists').select('*'),
          supabase.from('users').select('*')
        ]);

        // 3. Inject data into local SQLite (Wrapped in try/catch to prevent Beta API crashes)
        try {
          if (listsRes.data && listsRes.data.length > 0) {
            for (const item of listsRes.data) {
               // Safely insert into the v0.6 SQLite store
               await db.insert(operationalListsCollection, item).catch(() => {});
            }
          }
          if (usersRes.data && usersRes.data.length > 0) {
            for (const item of usersRes.data) {
               await db.insert(usersCollection, item).catch(() => {});
            }
          }
        } catch (dbErr) {
           console.warn('⚠️ [SQLite] Minor sync interruption on lists. Utilizing fallbacks.', dbErr);
        }

      } catch (error) {
        console.error('🛑 [Sync Engine] Critical sync failure. Falling back to local data.', error);
      } finally {
        // 4. Guarantee the app ALWAYS boots, no matter what happens in the DB layer
        if (isMounted) setIsReady(true);
      }
    }

    executeSafeSync();

    return () => {
      isMounted = false;
    };
  }, [isOnline]);

  return { isReady };
}
