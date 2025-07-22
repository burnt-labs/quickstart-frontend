// Minimal polyfills for Abstraxion
// @ts-ignore
window.global = window;

// @ts-ignore
window.process = window.process || {
  env: {},
  version: '',
  versions: {} as any,
};

// Define __dirname and __filename as empty strings for browser environment
// @ts-ignore
window.__dirname = '';
// @ts-ignore  
window.__filename = '';

export {};