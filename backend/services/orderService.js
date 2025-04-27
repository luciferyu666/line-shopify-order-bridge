import { filterOrdersByPhone } from '../../lib/shopify/orderFetcher.js';
import { query711 } from './logisticsService.js';

export async function getOrders(email, phone) {
  const list = await filterOrdersByPhone(email, phone);
  return Promise.all(
    list.map(async o => {
      const trackingNo = o.fulfillments?.[0]?.tracking_number;
      const logistics = trackingNo ? await query711(trackingNo) : null;
      return {
        id: o.id,
        name: o.name,
        created_at: o.created_at,
        financial_status: o.financial_status,
        total_price: o.total_price,
        order_status_url: o.order_status_url,
        tracking_no: trackingNo,
        tracking_url: trackingNo ? `https://www.7-11.com.tw/tracking?no=${trackingNo}` : null,
        logistics
      };
    })
  );
}
