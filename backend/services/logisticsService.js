// backend/services/logisticsService.js – resilient 7‑11 crawler (spec‑2 compliant)

import axios from "axios";
import cheerio from "cheerio";
import { config } from "dotenv";
config();

/**
 * 解析 7‑11 查件 HTML，嘗試多種 DOM 模式；若失敗則回傳 readable error。
 */
function parseHtml(html) {
  const $ = cheerio.load(html);
  const rows = [];

  // v1：舊式 #result table
  $("#result tr, table#resultTable tr").each((_, el) => {
    const tds = $(el).find("td");
    if (tds.length >= 2) {
      rows.push({
        time: $(tds[0]).text().trim(),
        status: $(tds[1]).text().trim(),
      });
    }
  });

  // v2：新版 <li> 進度列表
  if (!rows.length) {
    $("ul.progress > li").each((_, li) => {
      const time = $(li).find(".time").text().trim();
      const status = $(li).find(".status").text().trim();
      if (time && status) rows.push({ time, status });
    });
  }

  return rows;
}

/**
 * 查詢 7‑11 物流，並提供錯誤與 fallback 機制。
 * @param {string} trackingNo
 * @returns {Promise<{trackingNo:string, steps?:Array, error?:string}>}
 */
export async function query711(trackingNo) {
  const endpoint = process.env.SEVEN_ELEVEN_TRACKING_ENDPOINT;
  if (!endpoint) throw new Error("SEVEN_ELEVEN_TRACKING_ENDPOINT not set");

  const url = endpoint.endsWith("?")
    ? endpoint + trackingNo
    : `${endpoint}${trackingNo}`;

  try {
    const { data } = await axios.get(url, { timeout: 8000 });
    const steps = parseHtml(data);

    if (!steps.length) {
      return { trackingNo, error: "查無物流進度或網頁結構變動" };
    }
    return { trackingNo, steps };
  } catch (err) {
    return {
      trackingNo,
      error:
        err.code === "ECONNABORTED"
          ? "連線逾時，請稍後重試"
          : `查詢失敗：${err.response?.status || err.message}`,
    };
  }
}

// ---- Local mock for單元測試 ----
export function __mockHtml(rawHtml) {
  return parseHtml(rawHtml);
}
