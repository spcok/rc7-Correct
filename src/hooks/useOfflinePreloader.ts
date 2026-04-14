import { useEffect, useState } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { supabase } from '../lib/supabase';
import { 
  animalsCollection, 
  usersCollection, 
  operationalListsCollection,
  medicalLogsCollection,
  marChartsCollection,
  quarantineRecordsCollection,
  movementsCollection,
  transfersCollection,
  tasksCollection,
  timesheetsCollection,
  rotaCollection,
  holidaysCollection,
  safetyDrillsCollection,
  incidentsCollection,
  maintenanceCollection,
  firstAidCollection,
  dailyRoundsCollection,
  orgSettingsCollection,
  zlaDocumentsCollection,
  directoryCollection
} from '../lib/db';

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
        // Core Operational Data (High Priority)
        const [listsRes, usersRes, animalsRes, orgRes] = await Promise.all([
          supabase.from('operational_lists').select('*').eq('isDeleted', false),
          supabase.from('users').select('*'),
          supabase.from('animals').select('*').eq('isDeleted', false),
          supabase.from('organisations').select('*').single()
        ]);

        // Support Data (Secondary Priority)
        const [medicalRes, tasksRes, rotaRes, holidayRes] = await Promise.all([
          supabase.from('medical_logs').select('*').limit(500),
          supabase.from('tasks').select('*').eq('completed', false),
          supabase.from('staff_rota').select('*'),
          supabase.from('holidays').select('*')
        ]);

        const syncTable = async (collection: any, data: any[] | null) => {
          if (!data) return;
          for (const item of data) {
            await collection.upsert(item).catch(() => {});
          }
        };

        await Promise.all([
          syncTable(operationalListsCollection, listsRes.data),
          syncTable(usersCollection, usersRes.data),
          syncTable(animalsCollection, animalsRes.data),
          syncTable(orgSettingsCollection, orgRes.data ? [orgRes.data] : []),
          syncTable(medicalLogsCollection, medicalRes.data),
          syncTable(tasksCollection, tasksRes.data),
          syncTable(rotaCollection, rotaRes.data),
          syncTable(holidaysCollection, holidayRes.data)
        ]);

      } catch (error) {
        console.error('Sync Error:', error);
      } finally {
        if (isMounted) setIsReady(true);
      }
    }

    executeGlobalSync();
    return () => { isMounted = false; };
  }, [isOnline]);

  return { isReady };
}
