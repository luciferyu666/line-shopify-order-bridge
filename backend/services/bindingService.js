import { STATES } from '../utils/stateEnum.js';
import { isValidEmail, isValidPhone } from '../utils/validators.js';
import { saveBinding, getBinding } from '../models/userBindingModel.js';

const sessions = new Map();

export function getSession(user) {
  if (!sessions.has(user)) sessions.set(user, { state: STATES.IDLE });
  return sessions.get(user);
}

export async function handleInput(user, text) {
  const s = getSession(user);
  if (s.state === STATES.IDLE) {
    if (text.includes('查詢訂單')) {
      s.state = STATES.WAITING_PHONE;
      return { reply: '請輸入手機號碼：' };
    }
  } else if (s.state === STATES.WAITING_PHONE) {
    if (!isValidPhone(text)) return { reply: '電話格式錯誤，請重新輸入：' };
    s.phone = text;
    s.state = STATES.WAITING_EMAIL;
    return { reply: '請輸入 Email：' };
  } else if (s.state === STATES.WAITING_EMAIL) {
    if (!isValidEmail(text)) return { reply: 'Email 格式錯誤，請重新輸入：' };
    s.email = text;
    await saveBinding({ line_id: user, phone: s.phone, email: s.email });
    s.state = STATES.BOUND;
    return { reply: null, bound: true };
  }
  return { reply: '輸入「查詢訂單」開始。' };
}

export async function hasBinding(user) {
  return await getBinding(user);
}
