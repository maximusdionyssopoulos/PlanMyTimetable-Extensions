export default defineBackground(() => {
  const extensions = "https://mytimetable";

  browser.action.setBadgeBackgroundColor({ color: "#4ade80" });

  async function updateBadgeAndIcon() {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const currTab = tabs[0];
    if (currTab.url?.startsWith(extensions)) {
      Promise.all([
        browser.action.enable(),
        browser.action.setIcon({
          path: {
            16: "icon@16.png",
            48: "icon@48.png",
            128: "icon@128.png",
          },
        }),
        browser.action.setBadgeText({
          text: "+",
        }),
      ]);
    } else {
      Promise.all([
        browser.action.disable(),
        browser.action.setIcon({
          path: {
            16: "icon-greyed.png",
            48: "icon-greyed48.png",
            128: "icon-greyed128.png",
          },
        }),
        browser.action.setBadgeText({
          text: "",
        }),
      ]);
    }
  }

  browser.tabs.onActivated.addListener(updateBadgeAndIcon);
  browser.tabs.onUpdated.addListener(updateBadgeAndIcon);
  browser.runtime.onInstalled.addListener(updateBadgeAndIcon);
  browser.windows.onCreated.addListener(updateBadgeAndIcon);
  browser.windows.onFocusChanged.addListener(updateBadgeAndIcon);
});
