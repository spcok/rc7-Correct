import { 
  BrowserCollectionCoordinator, 
  createBrowserWASQLitePersistence, 
  openBrowserWASQLiteOPFSDatabase 
} from '@tanstack/browser-db-sqlite-persistence';
import sqliteWasm from '@sqlite.org/sqlite-wasm';

const DB_NAME = 'koa_offline_db';

// 1. Singleton pattern using globalThis to survive Vite HMR reloads
declare global {
  var __koa_persistence: any;
  var __koa_coordinator: any;
}

async function initDatabase() {
  // If we already have a connection in this browser session, reuse it
  if (globalThis.__koa_persistence) {
    return {
      persistence: globalThis.__koa_persistence,
      coordinator: globalThis.__koa_coordinator
    };
  }

  try {
    // 2. Initialize the coordinator to manage cross-tab state
    const coordinator = new BrowserCollectionCoordinator({ dbName: DB_NAME });
    
    // 3. Open the actual SQLite file in OPFS
    const database = await openBrowserWASQLiteOPFSDatabase({ 
      databaseName: DB_NAME 
    });

    // 4. Create the persistence bridge
    const persistence = createBrowserWASQLitePersistence({ 
      database, 
      coordinator, 
      getSqlite: () => sqliteWasm() 
    });

    // 5. Cache in global scope to prevent "sqlite3_open_v2" on next HMR reload
    globalThis.__koa_persistence = persistence;
    globalThis.__koa_coordinator = coordinator;

    console.log('✅ [SQLite] Persistent Vault Connection Established.');
    return { persistence, coordinator };
  } catch (err: any) {
    if (err?.message?.includes('sqlite3_open_v2') || err?.name?.includes('OPFS')) {
      console.error('🛑 [SQLite] LOCK ERROR: A previous session still holds the file lock.');
      console.warn('👉 ACTION REQUIRED: Please perform a FULL PAGE REFRESH (F5) to kill old workers.');
    }
    throw err;
  }
}

// Execute initialization
const { persistence, coordinator } = await initDatabase();

export const sqlitePersistence = persistence;
export { coordinator };
