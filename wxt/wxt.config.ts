import { defineConfig } from "wxt";
import Solid from "vite-plugin-solid";

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    build: {
      target: "esnext",
    },
    plugins: [Solid()],
  }),
  runner: {
    disabled: true,
    chromiumProfile:
      "/Users/maximusdionyss/Library/Application Support/Google/Chrome/Default",
  },
  manifest: {
    permissions: ["activeTab", "scripting"],
  },
});
