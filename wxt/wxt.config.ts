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
  manifest: {
    name: "PlanMyTimetable Capture",
    description: "Capture timetable data to use on PlanMyTimetable.",
    permissions: ["activeTab", "scripting", "tabs"],
    action: {
      default_icon: {
        "16": "icon-greyed.png",
        "48": "icon-greyed48.png",
        "128": "icon-greyed128.png",
      },
    },
  },
});
