import { Pool } from 'pg';

const globalForDb = global as unknown as { db: Pool };

export const db =
    globalForDb.db ||
    new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    });

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;

export const query = async (text: string, params?: any[]) => {
    const start = Date.now();
    const res = await db.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
};
