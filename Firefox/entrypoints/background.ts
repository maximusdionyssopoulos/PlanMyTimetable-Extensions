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
        await browser.browserAction.enable(),
        await browser.browserAction.setIcon({
          path: {
            16: "icon.svg",
            48: "icon.svg",
            96: "icon.svg",
            128: "icon.svg",
            256: "icon.svg",
          },
        }),
        await browser.browserAction.setBadgeText({
          text: "+",
        }),
      ]);
    } else {
      Promise.all([
        await browser.browserAction.disable(),
        await browser.browserAction.setIcon({
          path: {
            16: "icon-greyed.svg",
            48: "icon-greyed.svg",
            96: "icon-greyed.svg",
            128: "icon-greyed.svg",
            256: "icon-greyed.svg",
          },
        }),
        await browser.browserAction.setBadgeText({
          text: "",
        }),
      ]);
    }
  }

  browser.tabs.onActivated.addListener(updateBadgeAndIcon);
  browser.tabs.onUpdated.addListener(updateBadgeAndIcon);
  browser.runtime.onInstalled.addListener(updateBadgeAndIcon);
});
