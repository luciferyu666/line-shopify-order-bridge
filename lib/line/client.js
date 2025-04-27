import { Client } from '@line/bot-sdk';
import { config } from 'dotenv';
config();

export const lineClient = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
});
