import { createDatabase, collection } from '@tanstack/db';
import { createSqliteWasmAdapter } from '@tanstack/db/adapters/sqlite-wasm';
import sqliteWasm from '@sqlite.org/sqlite-wasm';

// 1. Initialize the pristine SQLite WebAssembly adapter via OPFS
const sqliteAdapter = createSqliteWasmAdapter({
  name: 'koa_offline_db',
  getSqlite: () => sqliteWasm(),
});

// 2. Define strict Beta schemas
export const animalsCollection = collection({ name: 'animals', primaryKey: 'id' });
export const dailyLogsCollection = collection({ name: 'daily_logs', primaryKey: 'id' });
export const medicalLogsCollection = collection({ name: 'medical_logs', primaryKey: 'id' });
export const usersCollection = collection({ name: 'users', primaryKey: 'id' });
export const operationalListsCollection = collection({ name: 'operational_lists', primaryKey: 'id' });
export const tasksCollection = collection({ name: 'tasks', primaryKey: 'id' });
export const movementsCollection = collection({ name: 'movements', primaryKey: 'id' });
export const timesheetsCollection = collection({ name: 'timesheets', primaryKey: 'id' });
export const orgSettingsCollection = collection({ name: 'organisations', primaryKey: 'id' });
export const zlaDocumentsCollection = collection({ name: 'zla_documents', primaryKey: 'id' });
export const directoryCollection = collection({ name: 'directory_contacts', primaryKey: 'id' });
export const dailyRoundsCollection = collection({ name: 'daily_rounds', primaryKey: 'id' });
export const marChartsCollection = collection({ name: 'mar_charts', primaryKey: 'id' });
export const quarantineRecordsCollection = collection({ name: 'quarantine_records', primaryKey: 'id' });
export const transfersCollection = collection({ name: 'external_transfers', primaryKey: 'id' });
export const rotaCollection = collection({ name: 'staff_rota', primaryKey: 'id' });
export const holidaysCollection = collection({ name: 'holidays', primaryKey: 'id' });
export const safetyDrillsCollection = collection({ name: 'safety_drills', primaryKey: 'id' });
export const incidentsCollection = collection({ name: 'incidents', primaryKey: 'id' });
export const maintenanceCollection = collection({ name: 'maintenance_logs', primaryKey: 'id' });
export const firstAidCollection = collection({ name: 'first_aid_logs', primaryKey: 'id' });

// 3. Export the concrete SQL DB
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
    timesheetsCollection,
    orgSettingsCollection,
    zlaDocumentsCollection,
    directoryCollection,
    dailyRoundsCollection,
    marChartsCollection,
    quarantineRecordsCollection,
    transfersCollection,
    rotaCollection,
    holidaysCollection,
    safetyDrillsCollection,
    incidentsCollection,
    maintenanceCollection,
    firstAidCollection
  ],
});
