export function orderCard(o) {
  return {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: `訂單 ${o.name}`, weight: 'bold', size: 'lg' },
        { type: 'text', text: `狀態：${o.financial_status}`, margin: 'md' },
        { type: 'text', text: `金額：$${o.total_price}`, margin: 'sm' },
        { type: 'text', text: `下單：${o.created_at.slice(0,10)}`, margin: 'sm' }
      ]
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'button',
          style: 'primary',
          action: { type: 'uri', label: '查看詳情', uri: o.order_status_url }
        },
        ...(o.tracking_no ? [{
          type: 'button',
          action: { type: 'uri', label: '追蹤物流', uri: o.tracking_url }
        }] : [])
      ]
    }
  };
}

export function ordersCarousel(list) {
  return {
    type: 'carousel',
    contents: list.slice(0,10).map(orderCard)
  };
}

export const boundSuccessMsg = { type: 'text', text: '✅ 綁定成功！輸入「查詢訂單」開始使用。' };
