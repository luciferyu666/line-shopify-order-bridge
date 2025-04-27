import { lineClient } from '../../lib/line/client.js';
import { ordersCarousel, boundSuccessMsg } from '../../lib/line/flexTemplates.js';
import { handleInput, hasBinding } from './bindingService.js';
import { getOrders } from './orderService.js';

export async function processEvent(event) {
  const userId = event.source.userId;
  if (event.type === 'message' && event.message.type === 'text') {
    const text = event.message.text.trim();
    // first check binding
    const binding = await hasBinding(userId);
    if (binding && text.includes('查詢訂單')) {
      const orders = await getOrders(binding.email, binding.phone);
      const msg = orders.length
        ? { type: 'flex', altText: '訂單資訊', contents: ordersCarousel(orders) }
        : { type: 'text', text: '查無訂單' };
      await lineClient.replyMessage(event.replyToken, msg);
      return;
    }
    // else go through binding FSM
    const result = await handleInput(userId, text);
    if (result.bound) {
      await lineClient.replyMessage(event.replyToken, boundSuccessMsg);
    } else {
      await lineClient.replyMessage(event.replyToken, { type: 'text', text: result.reply });
    }
  }
}
