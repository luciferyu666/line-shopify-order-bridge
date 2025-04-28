import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import React from "react";
import Orders from "../../frontend/src/pages/Orders";

// ---- Mock axios instance used in src/api/client.ts ----
vi.mock("../../frontend/src/api/client", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          name: "#1001",
          total_price: "500",
          financial_status: "paid",
          logistics: null,
        },
      ],
    }),
  },
}));

// -------------- Test suite --------------
describe("Orders page", () => {
  it("renders table after query", async () => {
    render(<Orders />);

    // 使用 i18n key 取得輸入框 Placeholder
    const emailInput = screen.getByPlaceholderText(
      "orders.emailPlaceholder"
    ) as HTMLInputElement;
    const phoneInput = screen.getByPlaceholderText(
      "orders.phonePlaceholder"
    ) as HTMLInputElement;

    fireEvent.input(emailInput, { target: { value: "demo@example.com" } });
    fireEvent.input(phoneInput, { target: { value: "0912345678" } });

    // 觸發查詢
    screen.getByText("orders.query").click();

    // 等待表格渲染
    await waitFor(() => {
      expect(screen.getByText("#1001")).toBeInTheDocument();
      expect(screen.getByText("paid")).toBeInTheDocument();
    });
  });
});
