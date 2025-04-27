import { query } from './db.js';

export async function getBinding(lineId) {
  const { rows } = await query('SELECT * FROM user_binding WHERE line_id=$1', [lineId]);
  return rows[0] || null;
}

export async function saveBinding({ line_id, phone, email }) {
  await query(
    `INSERT INTO user_binding(line_id, phone, email, bound_at)
     VALUES ($1,$2,$3,NOW())
     ON CONFLICT (line_id) DO UPDATE
       SET phone=EXCLUDED.phone, email=EXCLUDED.email, bound_at=NOW()`,
    [line_id, phone, email]
  );
}
