import { 
  BrowserCollectionCoordinator, 
  createBrowserWASQLitePersistence, 
  openBrowserWASQLiteIDBDatabase 
} from '@tanstack/browser-db-sqlite-persistence';
import sqliteWasm from '@sqlite.org/sqlite-wasm';

const DB_NAME = 'koa_offline_vault';

// 1. Singleton Guard for Vite HMR (Hot Module Replacement) stability
declare global {
  var __koa_db_persistence: any;
  var __koa_db_coordinator: any;
}

async function initPersistentStorage() {
  // Reuse existing connection during development reloads to prevent file lock collisions
  if (globalThis.__koa_db_persistence) {
    return { 
      persistence: globalThis.__koa_db_persistence, 
      coordinator: globalThis.__koa_db_coordinator 
    };
  }

  // 2. Initialize Coordinator to manage cross-tab state synchronization
  const coordinator = new BrowserCollectionCoordinator({ dbName: DB_NAME });

  // 3. Open SQLite using the IndexedDB VFS
  // This satisfies the Core Infrastructure requirement for IndexedDB persistence
  // and is immune to the OPFS 'sqlite3_open_v2' locking crashes.
  const database = await openBrowserWASQLiteIDBDatabase({ 
    databaseName: DB_NAME 
  });

  const persistence = createBrowserWASQLitePersistence({ 
    database, 
    coordinator, 
    getSqlite: () => sqliteWasm() 
  });

  // 4. Cache globally to ensure persistence across Vite HMR events
  globalThis.__koa_db_persistence = persistence;
  globalThis.__koa_db_coordinator = coordinator;

  console.log('✅ [Database] SQLite-on-IndexedDB Vault Established.');
  return { persistence, coordinator };
}

// Top-level await ensures the application boot sequence waits for database ready
const { persistence, coordinator } = await initPersistentStorage();

export const sqlitePersistence = persistence;
export { coordinator };
