import { 
  BrowserCollectionCoordinator, 
  createBrowserWASQLitePersistence, 
  openBrowserWASQLiteOPFSDatabase 
} from '@tanstack/browser-db-sqlite-persistence';
import sqliteWasm from '@sqlite.org/sqlite-wasm';

// Establish the shared coordinator for multi-tab synchronization
export const coordinator = new BrowserCollectionCoordinator({ dbName: 'koa_offline_db' });

// Open the Origin Private File System (OPFS) SQLite database
const database = await openBrowserWASQLiteOPFSDatabase({ databaseName: 'koa_offline_db' });

// Initialize the persistence bridge
export const sqlitePersistence = createBrowserWASQLitePersistence({ 
  database, 
  coordinator,
  getSqlite: () => sqliteWasm(),
});