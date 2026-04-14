import { createCollection } from '@tanstack/db';
import { persistedCollectionOptions } from '@tanstack/browser-db-sqlite-persistence';
import { sqlitePersistence } from '../persistence';
import { Task, Timesheet, Shift, Holiday } from '../../../types';

export const tasksCollection = createCollection(
  persistedCollectionOptions({
    id: 'tasks',
    getKey: (item: Task) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);

export const timesheetsCollection = createCollection(
  persistedCollectionOptions({
    id: 'timesheets',
    getKey: (item: Timesheet) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);

export const rotaCollection = createCollection(
  persistedCollectionOptions({
    id: 'staff_rota',
    getKey: (item: Shift) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);

export const holidaysCollection = createCollection(
  persistedCollectionOptions({
    id: 'holidays',
    getKey: (item: Holiday) => item.id,
    persistence: sqlitePersistence,
    schemaVersion: 1,
  })
);
