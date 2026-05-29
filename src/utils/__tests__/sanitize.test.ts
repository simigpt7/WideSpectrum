import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeEmail, sanitizePhone, isValidEmail, generateCSRFToken } from '../sanitize';

describe('sanitizeInput()', () => {
  it('removes < and > characters (prevents HTML injection)', () => {
    expect(sanitizeInput('<script>alert(1)</script>')).not.toContain('<');
    expect(sanitizeInput('<script>alert(1)</script>')).not.toContain('>');
  });

  it('removes javascript: protocol', () => {
    expect(sanitizeInput('javascript:alert(1)')).not.toContain('javascript:');
  });

  it('removes on* event handlers', () => {
    expect(sanitizeInput('onclick=evil()')).not.toContain('onclick=');
  });

  it('preserves plain text', () => {
    expect(sanitizeInput('Hello, world!')).toBe('Hello, world!');
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('truncates to 2000 characters', () => {
    const long = 'a'.repeat(3000);
    expect(sanitizeInput(long).length).toBe(2000);
  });
});

describe('sanitizeEmail()', () => {
  it('lowercases the email', () => {
    expect(sanitizeEmail('Test@Example.COM')).toBe('test@example.com');
  });

  it('strips invalid characters', () => {
    expect(sanitizeEmail('test<>@example.com')).toBe('test@example.com');
  });
});

describe('sanitizePhone()', () => {
  it('allows digits, +, -, spaces, parentheses', () => {
    expect(sanitizePhone('+91 (98) 765-4321')).toBe('+91 (98) 765-4321');
  });

  it('strips letters', () => {
    expect(sanitizePhone('abc123')).toBe('123');
  });
});

describe('isValidEmail()', () => {
  it('returns true for valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('returns false for invalid email', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('@nodomain')).toBe(false);
  });
});

describe('generateCSRFToken()', () => {
  it('returns a 64-character hex string', () => {
    const token = generateCSRFToken();
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });

  it('generates unique tokens', () => {
    expect(generateCSRFToken()).not.toBe(generateCSRFToken());
  });
});
