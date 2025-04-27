import { switchMenu } from '../../lib/line/richMenuHelper.js';
export async function boundMenu(user) {
  await switchMenu(user, true);
}
