import { createCollection } from '@tanstack/db';
import { persistedCollectionOptions } from '@tanstack/browser-db-sqlite-persistence';
import { sqlitePersistence } from '../persistence';
import { ClinicalNote, MARChart, QuarantineRecord } from '../../../types';

export const medicalLogsCollection = createCollection(
  persistedCollectionOptions({
    id: 'medical_logs',
    getKey: (item: ClinicalNote) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);

export const marChartsCollection = createCollection(
  persistedCollectionOptions({
    id: 'mar_charts',
    getKey: (item: MARChart) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);

export const quarantineRecordsCollection = createCollection(
  persistedCollectionOptions({
    id: 'quarantine_records',
    getKey: (item: QuarantineRecord) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);
