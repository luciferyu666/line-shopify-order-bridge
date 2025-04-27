import { middleware } from '@line/bot-sdk';
import { config } from 'dotenv';
import { processEvent } from '../backend/services/dialogueService.js';

config();
const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};
const lineMiddleware = middleware(lineConfig);

export default async function handler(req, res) {
  if (req.method === 'GET') return res.status(200).send('OK');
  await lineMiddleware(req, res, async () => {
    const events = req.body.events || [];
    await Promise.all(events.map(processEvent));
    res.status(200).json({ status: 'ok' });
  });
}
