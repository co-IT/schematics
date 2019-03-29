import 'jest-preset-angular';

/* global mocks for jsdom */
const mock = () => {
  let storage: { [key: string]: string } = {};
  return {
    clear: () => (storage = {}),
    getItem: (key: string) => (key in storage ? storage[key] : null),
    removeItem: (key: string) => delete storage[key],
    setItem: (key: string, value: string) => (storage[key] = value || '')
  };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance']
});

Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      configurable: true,
      enumerable: true
    };
  }
});
