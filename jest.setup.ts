import '@testing-library/jest-dom';
import messages from './src/messages/en.json';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => {
    return (key: string, values?: Record<string, string | number>) => {
      const keys = key.split('.');
      let value: unknown = messages;
      for (const k of keys) {
        value = (value as Record<string, unknown>)?.[k];
      }
      if (typeof value === 'string') {
        // Replace placeholders like {count}, {word}, {round}, {current}, {total}
        if (values) {
          return value.replace(/\{(\w+)(?:,\s*plural[^}]*)?\}/g, (_, k) => {
            const v = values[k];
            return v !== undefined ? String(v) : `{${k}}`;
          });
        }
        return value;
      }
      return key;
    };
  },
}));
