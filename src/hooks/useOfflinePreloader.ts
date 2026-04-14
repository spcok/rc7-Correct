import { useEffect, useState } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { supabase } from '../lib/supabase';
import { 
  animalsCollection, 
  usersCollection, 
  operationalListsCollection,
  orgSettingsCollection,
  medicalLogsCollection,
  tasksCollection,
  rotaCollection
} from '../lib/db';

export function useOfflinePreloader() {
  const [isReady, setIsReady] = useState(false);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    let isMounted = true;

    async function executeGlobalSync() {
      // If offline, bypass hydration and signal ready for local-first boot
      if (!isOnline) {
        if (isMounted) setIsReady(true);
        return;
      }

      try {
        console.log('📡 [Sync] Hydrating local vault from Supabase...');
        
        // Priority Data Fetch from Cloud source of truth
        const [listsRes, usersRes, animalsRes, orgRes] = await Promise.all([
          supabase.from('operational_lists').select('*').eq('is_deleted', false),
          supabase.from('users').select('*'),
          supabase.from('animals').select('*').eq('is_deleted', false),
          supabase.from('organisations').select('*').single()
        ]);

        /**
         * TanStack DB v0.6 Hydration Pattern:
         * Uses individual upserts inside a concurrent loop. 
         * Note: writeBatch is not a valid property of the collection object in this version.
         */
        const syncTable = async (collection: any, data: any[] | null) => {
          if (!data || data.length === 0) return;
          await Promise.all(data.map(item => collection.upsert(item).catch(() => {})));
        };

        // Parallel hydration of core operational data
        await Promise.all([
          syncTable(operationalListsCollection, listsRes.data),
          syncTable(usersCollection, usersRes.data),
          syncTable(animalsCollection, animalsRes.data),
          syncTable(orgSettingsCollection, orgRes.data ? [orgRes.data] : [])
        ]);

        console.log('✅ [Sync] Vault Hydration complete.');
      } catch (error) {
        console.error('🛑 [Sync] Hydration failed:', error);
      } finally {
        if (isMounted) setIsReady(true);
      }
    }

    executeGlobalSync();
    return () => { isMounted = false; };
  }, [isOnline]);

  return { isReady };
}
