import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // src配下のファイルはそのままの名前にする
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        background: "src/background.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },

  plugins: [react()],
});
