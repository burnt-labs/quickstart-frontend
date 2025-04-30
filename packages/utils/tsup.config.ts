import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  outDir: "dist",
  clean: true,
  splitting: false,
  shims: false,
  target: "esnext",
});
