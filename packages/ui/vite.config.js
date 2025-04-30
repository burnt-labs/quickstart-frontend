import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      entryRoot: "src",
      outputDir: "dist",
      insertTypesEntry: true,
      include: ["src"],
      rollupTypes: true,
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "ui",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
});
