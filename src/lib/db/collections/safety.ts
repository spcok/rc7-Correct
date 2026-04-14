import { createCollection } from '@tanstack/db';
import { persistedCollectionOptions } from '@tanstack/browser-db-sqlite-persistence';
import { sqlitePersistence } from '../persistence';
import { SafetyDrill, Incident, MaintenanceLog, FirstAidLog } from '../../../types';

export const safetyDrillsCollection = createCollection(
  persistedCollectionOptions({
    id: 'safety_drills',
    getKey: (item: SafetyDrill) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);

export const incidentsCollection = createCollection(
  persistedCollectionOptions({
    id: 'incidents',
    getKey: (item: Incident) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);

export const maintenanceCollection = createCollection(
  persistedCollectionOptions({
    id: 'maintenance_logs',
    getKey: (item: MaintenanceLog) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);

export const firstAidCollection = createCollection(
  persistedCollectionOptions({
    id: 'first_aid_logs',
    getKey: (item: FirstAidLog) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);
