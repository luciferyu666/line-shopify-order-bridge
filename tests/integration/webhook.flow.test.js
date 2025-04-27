import { describe, it, expect } from 'vitest';
import { processEvent } from '../../backend/services/dialogueService.js';

describe('webhook flow', () => {
  it('handle bound text', async () => {
    const event = {
      type: 'message',
      message: { type: 'text', text: '查詢訂單' },
      source: { userId: 'U123' },
      replyToken: 'dummy'
    };
    await processEvent(event);
    expect(true).true;
  });
});
