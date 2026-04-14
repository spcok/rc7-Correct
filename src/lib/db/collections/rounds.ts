import { createCollection } from '@tanstack/db';
import { persistedCollectionOptions } from '@tanstack/browser-db-sqlite-persistence';
import { sqlitePersistence } from '../persistence';
import { DailyRound } from '../../../types';

export const dailyRoundsCollection = createCollection(
  persistedCollectionOptions({
    id: 'daily_rounds',
    getKey: (item: DailyRound) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);
