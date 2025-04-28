// lib/logistics/seven.js
import axios from "axios";
import cheerio from "cheerio";
import { config } from "dotenv";
config();

/* ---------- HTML 解析（由舊 Service 移入） ---------- */
export function parseHtml(html = "") {
  const $ = cheerio.load(html);
  const rows = [];

  // v1: 舊 table
  $("#result tr, table#resultTable tr").each((_, tr) => {
    const tds = $(tr).find("td");
    if (tds.length >= 2)
      rows.push({
        time: $(tds[0]).text().trim(),
        desc: $(tds[1]).text().trim(),
      });
  });

  // v2: 新 list
  if (!rows.length) {
    $("ul.progress > li").each((_, li) => {
      const time = $(li).find(".time").text().trim();
      const desc = $(li).find(".status").text().trim();
      if (time && desc) rows.push({ time, desc });
    });
  }
  return rows;
}

/* ---------- Stub ---------- */
function stubStatus(trackingNo) {
  return {
    trackingNo,
    status: "已配送到店",
    storeCode: "123456",
    storeName: "台北南京門市",
    pickupDeadline: "2025-05-05",
    steps: [
      { time: "2025-04-28 10:23", desc: "店家已交寄" },
      { time: "2025-04-29 02:12", desc: "物流中心轉運" },
      { time: "2025-04-30 09:30", desc: "包裹送達門市" },
      { time: "2025-04-30 12:00", desc: "簡訊通知已發送" },
    ],
  };
}

/* ---------- 主查詢 ---------- */
export async function fetchShipmentStatus(
  trackingNo,
  { useStub = false } = {}
) {
  if (useStub) return stubStatus(trackingNo);

  const endpoint = process.env.SEVEN_ELEVEN_TRACKING_ENDPOINT;
  if (!endpoint) throw new Error("SEVEN_ELEVEN_TRACKING_ENDPOINT not set");

  const url = endpoint.endsWith("?")
    ? endpoint + trackingNo
    : `${endpoint}${trackingNo}`;
  const { data } = await axios.get(url, { timeout: 8000 });
  const steps = parseHtml(data);
  if (!steps.length) throw new Error("NO_PROGRESS");

  return { trackingNo, status: steps.at(-1)?.desc || "", steps };
}

/* ---------- 進度條 ---------- */
export async function fetchProgressSteps(trackingNo, opts) {
  const info = await fetchShipmentStatus(trackingNo, opts);
  return info.steps || [];
}

/* ---------- 測試輔助 ---------- */
export const __mockHtml = parseHtml;
export const __mockShipment = stubStatus;
