import { generateId } from '@/lib/storage';

// Note: readLobbies, writeLobbies, readUsers, writeUsers, readWords
// are file system operations that would require mocking fs in a real test.
// For simplicity, we test the pure functions here.

describe('Storage Utilities', () => {
  describe('generateId', () => {
    it('should generate a string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    it('should generate a non-empty string', () => {
      const id = generateId();
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate IDs of consistent length', () => {
      const id = generateId();
      // Based on implementation: Math.random().toString(36).substring(2, 9)
      expect(id.length).toBe(7);
    });

    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        ids.add(generateId());
      }

      // All IDs should be unique (or very close to it)
      expect(ids.size).toBe(iterations);
    });

    it('should only contain alphanumeric characters', () => {
      const id = generateId();
      expect(id).toMatch(/^[a-z0-9]+$/);
    });
  });
});
