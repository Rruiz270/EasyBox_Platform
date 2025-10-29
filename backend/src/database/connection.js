import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

let db = null;

export function getDatabase() {
  if (!db) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    const sql = neon(databaseUrl);
    db = drizzle(sql, { schema });
  }
  return db;
}

// For backward compatibility
export { getDatabase as db };
export default getDatabase;