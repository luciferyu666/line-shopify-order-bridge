import { describe, it, expect } from 'vitest';
import { getOrders } from '../../backend/services/orderService.js';

describe('orders', () => {
  it('mock returns array', async () => {
    const arr = await getOrders('demo@x.com', '0912345678');
    expect(Array.isArray(arr)).true;
  });
});
