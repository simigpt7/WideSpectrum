import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('filters undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('filters false booleans', () => {
    expect(cn('foo', false, 'bar')).toBe('foo bar');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });

  it('handles single class', () => {
    expect(cn('solo')).toBe('solo');
  });
});
