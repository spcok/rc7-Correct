import { createCollection } from '@tanstack/db';
import { persistedCollectionOptions } from '@tanstack/browser-db-sqlite-persistence';
import { sqlitePersistence } from '../persistence';
import { InternalMovement, Transfer } from '../../../types';

export const movementsCollection = createCollection(
  persistedCollectionOptions({
    id: 'movements',
    getKey: (item: InternalMovement) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);

export const transfersCollection = createCollection(
  persistedCollectionOptions({
    id: 'external_transfers',
    getKey: (item: Transfer) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);
