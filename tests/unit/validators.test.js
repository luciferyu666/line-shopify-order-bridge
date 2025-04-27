import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPhone } from '../../backend/utils/validators.js';

describe('validators', () => {
  it('email ok', () => expect(isValidEmail('a@b.com')).true);
  it('email bad', () => expect(isValidEmail('bad')).false);
  it('phone ok', () => expect(isValidPhone('0912345678')).true);
  it('phone bad', () => expect(isValidPhone('abc')).false);
});
