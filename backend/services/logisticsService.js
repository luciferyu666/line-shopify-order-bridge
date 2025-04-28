// backend/services/logisticsService.js
// 7-11 logistics facade (spec-2 compliant)
import {
  fetchShipmentStatus,
  fetchProgressSteps,
} from "../../lib/logistics/seven.js";
import { config } from "dotenv";
config();

/**
 * 供 Controller / Rich-Menu 按鈕呼叫
 */
export async function query711(trackingNo) {
  try {
    // 1) 強制使用 Stub（本地 / CI）
    if (process.env.USE_STUB_711 === "true") {
      return await fetchShipmentStatus(trackingNo, { useStub: true });
    }

    // 2) 呼叫 lib 層 (內部會自動決定 API 或爬蟲)
    const info = await fetchShipmentStatus(trackingNo);

    // 3) 若沒有附帶 progress，補抓一次
    if (!info.steps?.length) {
      info.steps = await fetchProgressSteps(trackingNo);
    }

    return info; // = { trackingNo, status, storeCode, ... , steps }
  } catch (err) {
    return {
      trackingNo,
      code: "FETCH_ERROR",
      message: err.message || "7-11 物流查詢失敗",
    };
  }
}

// Vitest helper
export const __mockShipment = fetchShipmentStatus;
