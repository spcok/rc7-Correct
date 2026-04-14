import { useEffect, useState } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { supabase } from '@/lib/supabase';
import { 
  animalsCollection, 
  usersCollection, 
  operationalListsCollection,
  medicalLogsCollection,
  tasksCollection,
  rotaCollection,
  holidaysCollection,
  orgSettingsCollection
} from '@/lib/db';

export function useOfflinePreloader() {
  const [isReady, setIsReady] = useState(false);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    let isMounted = true;

    async function executeGlobalSync() {
      // 1. If offline, boot instantly from local SQLite
      if (!isOnline) {
        console.log('📡 [Sync] Offline. Loading from local SQLite OPFS.');
        if (isMounted) setIsReady(true);
        return;
      }

      try {
        console.log('📡 [Sync] Online. Hydrating local database from Supabase...');
        
        // Priority Fetch
        const [listsRes, usersRes, animalsRes, orgRes] = await Promise.all([
          supabase.from('operational_lists').select('*').eq('is_deleted', false),
          supabase.from('users').select('*'),
          supabase.from('animals').select('*').eq('is_deleted', false),
          supabase.from('organisations').select('*').single()
        ]);

        const syncTable = async (collection: any, data: any[] | null) => {
          if (!data || data.length === 0) return;
          for (const item of data) {
            // v0.6 uses .upsert() to merge server data into local SQLite
            await collection.upsert(item).catch(() => {});
          }
        };

        // Execute parallel hydration
        await Promise.all([
          syncTable(operationalListsCollection, listsRes.data),
          syncTable(usersCollection, usersRes.data),
          syncTable(animalsCollection, animalsRes.data),
          syncTable(orgSettingsCollection, orgRes.data ? [orgRes.data] : [])
        ]);

        console.log('✅ [Sync] Hydration complete.');
      } catch (error) {
        console.error('🛑 [Sync] Error during hydration:', error);
      } finally {
        if (isMounted) setIsReady(true);
      }
    }

    executeGlobalSync();
    return () => { isMounted = false; };
  }, [isOnline]);

  return { isReady };
}
