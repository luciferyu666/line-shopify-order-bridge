// 共用訂單 Type 定義 – 供前端型別安全

export interface LogisticsStep {
  time: string;
  status: string;
}

export interface Order {
  id: string | number;
  name: string; // Shopify #編號
  created_at: string; // ISO string
  financial_status: string; // paid / pending / refunded ...
  total_price: string; // 金額字串
  order_status_url: string; // Shopify 訂單網址
  tracking_no?: string | null;
  tracking_url?: string | null;
  logistics?: {
    trackingNo: string;
    steps: LogisticsStep[];
    error?: string;
  } | null;
}
