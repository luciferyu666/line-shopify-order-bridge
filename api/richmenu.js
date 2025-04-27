import { switchMenu } from '../lib/line/richMenuHelper.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { userId, bound } = req.body;
  await switchMenu(userId, bound);
  res.status(200).json({ ok: true });
}
