// tests/setup.ts
import { vi } from "vitest";
import "@testing-library/jest-dom/vitest"; // ✔ expect 擴充

/* ------------------------------------------------------------------
 * 0. 指定 CSS 檔案 mock → 回傳空物件，避免 Vite 解析
 * ----------------------------------------------------------------*/
vi.mock("../frontend/src/components/loader.css", () => ({}));
vi.mock("../frontend/src/components/toast.css", () => ({}));

/* ------------------------------------------------------------------
 * mock react-i18next：t(key) 直接回傳 key
 * ----------------------------------------------------------------*/
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn() },
  }),
}));

/* ------------------------------------------------------------------
 * 1. mock LINE SDK 客戶端
 * ----------------------------------------------------------------*/
vi.mock("../lib/line/client", () => ({
  lineClient: {
    replyMessage: vi.fn(),
    pushMessage: vi.fn(),
  },
}));

/* ------------------------------------------------------------------
 * 2. mock Shopify 訂單查詢服務
 * ----------------------------------------------------------------*/
vi.mock("../backend/services/orderService.js", () => ({
  getOrders: vi
    .fn()
    .mockResolvedValue([
      { id: 1, name: "#1001", total_price: "500", financial_status: "paid" },
    ]),
}));

/* ------------------------------------------------------------------
 * 3. mock PostgreSQL 查詢
 *    - 預設 rows: [] 代表尚未綁定
 * ----------------------------------------------------------------*/
vi.mock("../backend/models/db.js", () => {
  const query = vi.fn().mockResolvedValue({ rows: [] });
  return { query };
});

/* ------------------------------------------------------------------
 * （範例）在個別測試覆寫 DB 回傳以模擬已綁定：
 *
 * import { query } from '../../backend/models/db.js';
 * vi.mocked(query).mockResolvedValueOnce({
 *   rows: [{ line_id: 'U123', phone: '0912345678', email: 'demo@x.com' }],
 * });
 * ----------------------------------------------------------------*/
