import crypto from 'crypto';
import { config } from 'dotenv';
config();
export function validateSignature(req) {
  const signature = req.headers['x-line-signature'] || '';
  const body = JSON.stringify(req.body);
  const hash = crypto
    .createHmac('SHA256', process.env.LINE_CHANNEL_SECRET || '')
    .update(body)
    .digest('base64');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hash));
}
