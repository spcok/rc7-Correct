import { createCollection } from '@tanstack/db';
import { persistedCollectionOptions } from '@tanstack/browser-db-sqlite-persistence';
import { sqlitePersistence } from '../persistence';
import { UserProfile } from '../../../types';

export const usersCollection = createCollection(
  persistedCollectionOptions({
    id: 'users',
    getKey: (item: UserProfile) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);
