import { describe, it, expect } from 'vitest';

describe('Sample Unit Tests', () => {
  it('should pass a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const greeting = 'Hello, World!';
    expect(greeting).toContain('World');
    expect(greeting).toHaveLength(13);
  });

  it('should handle array operations', () => {
    const items = ['a', 'b', 'c'];
    expect(items).toHaveLength(3);
    expect(items).toContain('b');
  });

  it('should handle object assertions', () => {
    const user = { name: 'Giorgos', role: 'Engineer' };
    expect(user).toHaveProperty('name');
    expect(user.name).toBe('Giorgos');
  });

  it('should handle async operations', async () => {
    const fetchData = () => Promise.resolve({ data: 'test' });
    const result = await fetchData();
    expect(result.data).toBe('test');
  });
});
