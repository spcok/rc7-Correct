import { 
  BrowserCollectionCoordinator, 
  createBrowserWASQLitePersistence, 
  openBrowserWASQLiteOPFSDatabase 
} from '@tanstack/browser-db-sqlite-persistence';
import sqliteWasm from '@sqlite.org/sqlite-wasm';

const DB_NAME = 'koa_offline_db';

declare global {
  var __koa_persistence: any;
  var __koa_coordinator: any;
  // Track the active initialization promise to prevent race conditions
  var __koa_db_promise: Promise<any> | undefined; 
}

async function initDatabase() {
  // 1. Return immediately if already established
  if (globalThis.__koa_persistence) {
    return {
      persistence: globalThis.__koa_persistence,
      coordinator: globalThis.__koa_coordinator
    };
  }

  // 2. If an initialization is currently in flight, await it instead of trying to lock again
  if (globalThis.__koa_db_promise) {
    return globalThis.__koa_db_promise;
  }

  // 3. Begin initialization and store the promise
  globalThis.__koa_db_promise = (async () => {
    try {
      const coordinator = new BrowserCollectionCoordinator({ dbName: DB_NAME });
      const database = await openBrowserWASQLiteOPFSDatabase({ 
        databaseName: DB_NAME 
      });

      const persistence = createBrowserWASQLitePersistence({ 
        database, 
        coordinator, 
        getSqlite: () => sqliteWasm() 
      });

      globalThis.__koa_persistence = persistence;
      globalThis.__koa_coordinator = coordinator;

      console.log('✅ [SQLite] Persistent Vault Connection Established.');
      return { persistence, coordinator };
    } catch (err: any) {
      globalThis.__koa_db_promise = undefined; // Reset promise on failure
      throw err;
    }
  })();

  return globalThis.__koa_db_promise;
}

const { persistence, coordinator } = await initDatabase();

export const sqlitePersistence = persistence;
export { coordinator };
