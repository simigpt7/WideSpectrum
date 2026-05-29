import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeEmail, sanitizePhone } from '../utils/sanitize';

describe('sanitize utilities', () => {
  describe('sanitizeInput', () => {
    it('should encode HTML tags', () => {
      const result = sanitizeInput('<script>alert("xss")</script>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    it('should encode quotes', () => {
      const result = sanitizeInput('Hello "World"');
      expect(result).toContain('&quot;');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
    });
  });

  describe('sanitizeEmail', () => {
    it('should convert to lowercase', () => {
      expect(sanitizeEmail('TEST@Example.COM')).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      expect(sanitizeEmail('  test@example.com  ')).toBe('test@example.com');
    });

    it('should return empty for invalid emails', () => {
      expect(sanitizeEmail('invalid')).toBe('');
      expect(sanitizeEmail('test@')).toBe('');
    });

    it('should accept valid emails', () => {
      expect(sanitizeEmail('test@example.com')).toBe('test@example.com');
    });
  });

  describe('sanitizePhone', () => {
    it('should keep numbers, +, and spaces', () => {
      const result = sanitizePhone('+1 (555) 123-4567');
      expect(result).toContain('+');
      expect(result).toMatch(/\d/);
    });

    it('should remove invalid characters', () => {
      const result = sanitizePhone('555-123-4567');
      expect(result).toBe('5551234567');
    });
  });
});
