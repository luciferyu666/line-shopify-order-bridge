// tests/unit/orderService.test.js

import { describe, it, expect } from "vitest";
import { getOrders } from "../../backend/services/orderService.js";
// ＊getOrders 的 mock 已在 tests/setup.ts 全域處理

describe("orders", () => {
  it("mock returns array", async () => {
    const arr = await getOrders("demo@x.com", "0912345678");
    expect(Array.isArray(arr)).toBe(true);
  });
});
