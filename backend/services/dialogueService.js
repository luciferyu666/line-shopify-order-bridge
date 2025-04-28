// backend/services/dialogueService.js - updated to spec‑2

import { lineClient } from "../../lib/line/client.js";
import {
  ordersCarousel,
  boundSuccessMsg,
} from "../../lib/line/flexTemplates.js";
import { handleInput, hasBinding } from "./bindingService.js";
import { getOrders } from "./orderService.js";
import { boundMenu } from "./richMenuService.js";

/**
 * 產生 LINE Quick Reply 物件
 * @param {Array<{label:string,text:string}>} opts
 */
function buildQuickReply(opts = []) {
  return {
    items: opts.map((o) => ({
      type: "action",
      action: {
        type: "message",
        label: o.label,
        text: o.text,
      },
    })),
  };
}

/**
 * 依 spec‑2：
 * 1. 綁定成功後自動切換 Rich Menu
 * 2. 使用 Quick Reply 引導使用者輸入電話 / Email
 */
export async function processEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") return;

  const userId = event.source.userId;
  const text = event.message.text.trim();

  // 🔍 已綁定且要求查詢
  const binding = await hasBinding(userId);
  if (binding && text.includes("查詢訂單")) {
    const orders = await getOrders(binding.email, binding.phone);
    const msg = orders.length
      ? { type: "flex", altText: "訂單資訊", contents: ordersCarousel(orders) }
      : { type: "text", text: "查無訂單" };
    await lineClient.replyMessage(event.replyToken, msg);
    return;
  }

  // 🌀 多輪對話狀態機
  const result = await handleInput(userId, text);

  /**  根據 state 回覆對應文字 + Quick Reply  **/
  if (result.bound) {
    // 🎉 綁定完成：切 Rich Menu、回覆成功訊息
    await boundMenu(userId);
    await lineClient.replyMessage(event.replyToken, boundSuccessMsg);
    return;
  }

  // 尚未完成綁定 → 給提示 + Quick Reply
  const quick = buildQuickReply([{ label: "取消", text: "取消綁定" }]);
  await lineClient.replyMessage(event.replyToken, {
    type: "text",
    text: result.reply,
    quickReply: quick,
  });
}
