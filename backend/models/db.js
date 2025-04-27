import pkg from 'pg';
import { config } from 'dotenv';
config();
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DB_URL,
  max: 5,
  idleTimeoutMillis: 10000
});

export async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
