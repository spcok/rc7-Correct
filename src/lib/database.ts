import { createDatabase, collection } from '@tanstack/react-db';
import { createSqliteWasmAdapter } from '@tanstack/react-db/adapters/sqlite-wasm';
import sqliteWasm from '@sqlite.org/sqlite-wasm';

// 1. Initialize the true relational SQLite WebAssembly adapter
// This creates a highly performant 'koa_offline.sqlite' file directly in the browser's OPFS
const sqliteAdapter = createSqliteWasmAdapter({
  name: 'koa_offline_db',
  getSqlite: () => sqliteWasm(),
});

// 2. Define the strict schemas (TanStack DB automatically creates the SQL tables for these)
export const animalsCollection = collection({
  name: 'animals',
  primaryKey: 'id',
});

export const dailyLogsCollection = collection({
  name: 'daily_logs',
  primaryKey: 'id',
});

export const medicalLogsCollection = collection({
  name: 'medical_logs',
  primaryKey: 'id',
});

export const usersCollection = collection({
  name: 'users',
  primaryKey: 'id',
});

export const operationalListsCollection = collection({
  name: 'operational_lists',
  primaryKey: 'id',
});

export const tasksCollection = collection({
  name: 'tasks',
  primaryKey: 'id',
});

export const movementsCollection = collection({
  name: 'movements',
  primaryKey: 'id',
});

export const timesheetsCollection = collection({
  name: 'timesheets',
  primaryKey: 'id',
});

// 3. Initialize the Database Engine
export const db = createDatabase({
  adapter: sqliteAdapter,
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
