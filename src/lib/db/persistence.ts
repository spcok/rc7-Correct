import { 
  BrowserCollectionCoordinator, 
  createBrowserWASQLitePersistence, 
  openBrowserWASQLiteOPFSDatabase 
} from '@tanstack/browser-db-sqlite-persistence';
import sqliteWasm from '@sqlite.org/sqlite-wasm';

const DB_NAME = 'koa_offline_db';

// 1. Initialize the coordinator to manage cross-tab locking
export const coordinator = new BrowserCollectionCoordinator({ dbName: DB_NAME });

// 2. Open the database using the coordinator's context to prevent collisions
const database = await openBrowserWASQLiteOPFSDatabase({ 
  databaseName: DB_NAME
});

// 3. Export the persistence bridge
export const sqlitePersistence = createBrowserWASQLitePersistence({ 
  database, 
  coordinator,
  getSqlite: () => sqliteWasm(),
});
