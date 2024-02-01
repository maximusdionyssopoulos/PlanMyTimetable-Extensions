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
  },
  manifest: {
    name: "PlanMyTimetable Capture",
    description: "Capture timetable data to use on PlanMyTimetable.",
    browser_specific_settings: {
      gecko: {
        id: "Capture@PlanMyTimetable.org",
        strict_min_version: "109.0",
      },
    },
    permissions: ["activeTab", "scripting", "tabs"],
    browser_action: {
      default_title: "PlanMyTimetable Capture",
      default_icon: {
        "16": "icon-greyed.svg",
        "48": "icon-greyed.svg",
        "96": "icon-greyed.svg",
        "128": "icon-greyed.svg",
        "256": "icon-greyed.svg",
      },
    },
    icons: {
      "16": "icon.svg",
      "48": "icon.svg",
      "96": "icon.svg",
      "128": "icon.svg",
      "256": "icon.svg",
    },
  },
});
