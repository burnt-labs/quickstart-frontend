import { Buffer } from 'buffer';

// @ts-ignore
window.Buffer = Buffer;
// @ts-ignore
window.global = window;
// @ts-ignore
window.process = {
  env: {},
  version: '',
  versions: {},
  // Add other process properties as needed
};

export {};