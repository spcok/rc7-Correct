import { createCollection } from '@tanstack/db';
import { persistedCollectionOptions } from '@tanstack/browser-db-sqlite-persistence';
import { sqlitePersistence } from '../persistence';
import { LogEntry } from '../../../types';

export const dailyLogsCollection = createCollection(
  persistedCollectionOptions({
    id: 'daily_logs',
    getKey: (item: LogEntry) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);
