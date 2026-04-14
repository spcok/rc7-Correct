import { createCollection } from '@tanstack/db';
import { persistedCollectionOptions } from '@tanstack/browser-db-sqlite-persistence';
import { sqlitePersistence } from '../persistence';
import { Animal } from '../../../types';

export const animalsCollection = createCollection(
  persistedCollectionOptions({
    id: 'animals',
    getKey: (item: Animal) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);
