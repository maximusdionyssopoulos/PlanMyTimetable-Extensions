export default defineBackground(() => {
  const extensions = "https://mytimetable";

  browser.browserAction.setBadgeBackgroundColor({ color: "#4ade80" });

  async function updateBadgeAndIcon() {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    const currTab = tabs[0];
    if (currTab.url?.startsWith(extensions)) {
      Promise.all([
        browser.browserAction.enable(),
        browser.browserAction.setIcon({
          path: {
            16: "icon.svg",
            48: "icon.svg",
            96: "icon.svg",
            128: "icon.svg",
            256: "icon.svg",
          },
        }),
        browser.browserAction.setBadgeText({
          text: "+",
        }),
      ]);
    } else {
      Promise.all([
        browser.browserAction.disable(),
        browser.browserAction.setIcon({
          path: {
            16: "icon-greyed.svg",
            48: "icon-greyed.svg",
            96: "icon-greyed.svg",
            128: "icon-greyed.svg",
            256: "icon-greyed.svg",
          },
        }),
        browser.browserAction.setBadgeText({
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
