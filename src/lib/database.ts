import { createDatabase, collection } from '@tanstack/react-db';

export const animalsCollection = collection({ name: 'animals', primaryKey: 'id' });
export const dailyLogsCollection = collection({ name: 'daily_logs', primaryKey: 'id' });
export const medicalLogsCollection = collection({ name: 'medical_logs', primaryKey: 'id' });
export const usersCollection = collection({ name: 'users', primaryKey: 'id' });
export const operationalListsCollection = collection({ name: 'operational_lists', primaryKey: 'id' });
export const tasksCollection = collection({ name: 'tasks', primaryKey: 'id' });
export const movementsCollection = collection({ name: 'movements', primaryKey: 'id' });
export const timesheetsCollection = collection({ name: 'timesheets', primaryKey: 'id' });

export const db = createDatabase({
  collections: [
    animalsCollection,
    dailyLogsCollection,
    medicalLogsCollection,
    usersCollection,
    operationalListsCollection,
    tasksCollection,
    movementsCollection,
    timesheetsCollection
  ],
});
