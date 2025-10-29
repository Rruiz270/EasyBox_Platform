import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

let db = null;

export function getDatabase() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema });
  }
  return db;
}

// For backward compatibility
export { getDatabase as db };
export default getDatabase;