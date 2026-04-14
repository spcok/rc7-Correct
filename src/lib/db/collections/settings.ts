import { createCollection } from '@tanstack/db';
import { persistedCollectionOptions } from '@tanstack/browser-db-sqlite-persistence';
import { sqlitePersistence } from '../persistence';
import { OrgProfileSettings, ZLADocument, Contact } from '../../../types';

export const orgSettingsCollection = createCollection(
  persistedCollectionOptions({
    id: 'organisations',
    getKey: (item: OrgProfileSettings) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);

export const zlaDocumentsCollection = createCollection(
  persistedCollectionOptions({
    id: 'zla_documents',
    getKey: (item: ZLADocument) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);

export const directoryCollection = createCollection(
  persistedCollectionOptions({
    id: 'directory_contacts',
    getKey: (item: Contact) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);
