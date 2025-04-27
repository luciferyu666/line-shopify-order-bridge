import { lineClient } from './client.js';
import { config } from 'dotenv';
config();
export async function switchMenu(userId, bound=false) {
  const menuId = bound ? process.env.RICH_MENU_BOUND_ID : process.env.RICH_MENU_UNBOUND_ID;
  if (menuId) await lineClient.linkRichMenuToUser(userId, menuId);
}
