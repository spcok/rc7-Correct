import { useEffect, useState } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { supabase } from '@/lib/supabase';
import { 
  animalsCollection, 
  usersCollection, 
  operationalListsCollection,
  orgSettingsCollection
} from '@/lib/db';

export function useOfflinePreloader() {
  const [isReady, setIsReady] = useState(false);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    let isMounted = true;

    async function executeGlobalSync() {
      if (!isOnline) {
        if (isMounted) setIsReady(true);
        return;
      }

      try {
        console.log('📡 [Sync] Hydrating local database from Supabase...');
        
        const [listsRes, usersRes, animalsRes, orgRes] = await Promise.all([
          supabase.from('operational_lists').select('*').eq('is_deleted', false),
          supabase.from('users').select('*'),
          supabase.from('animals').select('*').eq('is_deleted', false),
          supabase.from('organisations').select('*').single()
        ]);

        const syncTable = async (collection: any, data: any[] | null) => {
          if (!data || data.length === 0) return;
          for (const item of data) {
            await collection.upsert(item).catch(() => {});
          }
        };

        await Promise.all([
          syncTable(operationalListsCollection, listsRes.data),
          syncTable(usersCollection, usersRes.data),
          syncTable(animalsCollection, animalsRes.data),
          syncTable(orgSettingsCollection, orgRes.data ? [orgRes.data] : [])
        ]);

        console.log('✅ [Sync] Hydration complete.');
      } catch (error) {
        console.error('🛑 [Sync] Hydration Error:', error);
      } finally {
        if (isMounted) setIsReady(true);
      }
    }

    executeGlobalSync();
    return () => { isMounted = false; };
  }, [isOnline]);

  return { isReady };
}
