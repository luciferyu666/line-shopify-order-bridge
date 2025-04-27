import { shopify } from './restClient.js';

export async function fetchOrders(email) {
  const { data } = await shopify.get('/orders.json', {
    params: { email, status: 'any', limit: 50 }
  });
  return data.orders || [];
}

export async function filterOrdersByPhone(email, phone) {
  const orders = await fetchOrders(email);
  const tail = phone.slice(-4);
  return orders.filter(o => (o.phone || '').endsWith(tail));
}
