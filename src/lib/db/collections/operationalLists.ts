import { createCollection } from '@tanstack/db';
import { persistedCollectionOptions } from '@tanstack/browser-db-sqlite-persistence';
import { sqlitePersistence } from '../persistence';
import { OperationalList } from '../../../types';

export const operationalListsCollection = createCollection(
  persistedCollectionOptions({
    id: 'operational_lists',
    getKey: (item: OperationalList) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);
